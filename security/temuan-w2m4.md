# Findings — Week 2, Module 4 (Secure Code and Hardening)

Sources: **Agent review** (`security/security-review.md`, evidence anchored to `file:line`), **Semgrep CE** (`semgrep scan --config p/react --config p/typescript --config p/owasp-top-ten`, raw output `semgrep.json` — git-ignored), **npm audit** (`security/npm-audit.md`), **Header scan** (securityheaders.com), **Sentry** (issue KOPI-KITA-4 from Module 2).

Status key: **Fixed** (merged PR), **Open** (not fixed yet — material for the Module 5 autopilot), **Accepted** (deliberate decision, reason written).

| ID | Source | OWASP 2025 | Location | Summary | Priority | Status | PR |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| F1 | Agent review | A07, A08 | `src/app/admin/login/page.tsx:88-89`, `src/server/db/seed.sql:26-28` | Demo admin credentials printed on the login page; same account seeds production | High | **Fixed** — UI credentials removed, and default production password changed and verified | [#9](https://github.com/Irfansangjuara/kopi-kita/pull/9) |
| F2 | Agent review | A07 | `src/server/routes/auth.ts` (login) | No rate limit or lockout on the single admin login: unlimited password guessing | High | **Fixed** — 429 after 5 failures in 15m, persistent DB counter; merged & verified in production | [#10](https://github.com/Irfansangjuara/kopi-kita/pull/10) |
| F3 | Agent review | A09 | `src/server/routes/auth.ts` (401 branches) | Failed logins were neither logged nor alerted, so brute force was invisible | Medium | **Fixed** — logged with key, reported to Sentry, generic 401 response; merged | [#10](https://github.com/Irfansangjuara/kopi-kita/pull/10) |
| F4 | Agent review | A01 | `src/app/admin/{page,products/page,bookings/page,layout}.tsx` | `/admin/**` pages redirect in the client only; no server-side gate (no `middleware.ts` exists) | Medium | **Accepted** — every data endpoint re-checks with `requireAdmin`, so no data leaks; the shell renders before the redirect. Recorded in `security/threat-model.md` residual risk | — |
| F5 | Agent review | A10 | `src/server/routes/auth.ts:65-69` | Logout swallows a failed session delete and still returns 204, so a session can outlive "logout" | Medium | **Open** (the failure is now reported to Sentry by `reportServerError`, so it is visible; the flow itself is unchanged) | — |
| F6 | Agent review | A02 | `src/server/routes/auth.ts:44-50` | Session cookie flags defined inline, `secure` driven by `NODE_ENV`, and not mirrored on `clearCookie` | Medium | **Fixed** — one definition in `src/server/session-cookie.ts`, used by login, logout and `requireAdmin` | [#3](https://github.com/Irfansangjuara/kopi-kita/pull/3) |
| F7 | Agent review | A06 | `src/server/routes/bookings.ts:12-23` | `booking_time` is free text, `customer_name`/`notes` unbounded → DB truncation errors surface as 500 | Medium | **Open** | — |
| F8 | Agent review | A06 | `src/server/routes/products.ts:35-57, 70-95` | `price` not required to be an integer, `image_url` unvalidated, lengths uncapped | Medium | **Open** | — |
| F9 | Agent review + Header scan | A02 | `next.config.ts` | No security headers and no CSP; securityheaders.com grade **D** | Medium | **Fixed** — HSTS, nosniff, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy, CSP, `poweredByHeader: false` | [#3](https://github.com/Irfansangjuara/kopi-kita/pull/3) |
| F10 | Agent review | A10 | `src/server/routes/products.ts:67,109`, `src/server/routes/bookings.ts:84` | `:id` never validated as an integer → Postgres cast error becomes a generic 500 instead of 400 | Low | **Open** | — |
| F11 | Agent review | A06 | `src/server/db/schema.sql` (sessions) | Expired sessions are never purged; the table grows without bound | Low | **Open** | — |
| F12 | Agent review | A02 | `src/server/routes/auth.ts:71` | `clearCookie` did not mirror the set-time options | Low | **Fixed** (same PR as F6) | [#3](https://github.com/Irfansangjuara/kopi-kita/pull/3) |
| F13 | Agent review | A02 | `src/app/api/health/route.ts` | Public health endpoint reveals database reachability | Low | **Accepted** — that is exactly what the uptime monitor needs; it returns no details | — |
| F14 | Agent review | A01, A05 | `api/**` (legacy standalone backend) | Dormant duplicate API with in-memory sessions and a separate CORS setup | Low | **Open** — confirm it is not deployed, then delete | — |
| F15 | npm audit | A03 | `package.json` | 5 high advisories, all in the dev-only `eslint-config-next → fast-glob → micromatch → braces` chain | Low | **Accepted** — never shipped; npm's only "fix" is a downgrade to Next 14. Tracked by Dependabot | — |
| S1, S2 | Semgrep | A03, A08 | `.github/dependabot.yml` | Dependabot without a cooldown adopts freshly published (possibly malicious) versions | Medium | **Fixed** — `cooldown: default-days: 7` on both ecosystems; rescan → 0 findings | [#2](https://github.com/Irfansangjuara/kopi-kita/pull/2) |
| M2-1 | Sentry (Module 2) | A10 | `src/app/api/[...slug]/route.ts` | Malformed JSON on `POST /api/bookings` answers 500 and then kills the function (`removeListener`) — Sentry issue **KOPI-KITA-4** | Medium | **Open** | — |
| F16 | Own curl proof | A10 | `src/app/api/[...slug]/route.ts` | A GET that carries a JSON body answers 500 (`GET /api/bookings` with `-d '{}'`), while the same request without a body answers 401 — the bridge mishandles bodies on GET/HEAD | Low | **Open** | — |

## Verification of F1, F2, F3 on production (PR #10 merged)

PR [#10](https://github.com/Irfansangjuara/kopi-kita/pull/10) is merged into `main` and live in production.
- `login_attempts` table is created and indexed in the production database.
- Password guessing generates HTTP 429 `{"error":"Too many attempts, try again later"}` once failures reach 5.
- The default admin password `kopikita-admin` is disabled (answers 401).
- The new production admin password is active, returns 200, sets `sessionId` cookie with `HttpOnly; Secure; SameSite=Lax`, and resets failed attempts.
## Verified-good (so the reviewer can see what was checked and found clean)

- **Every admin endpoint answers 401 without a session cookie**: `GET /api/bookings`, `PATCH /api/bookings/:id`, `POST|PUT|DELETE /api/products/:id` (curl proof in the rate-limit and headers PRs; the Express `requireAdmin` middleware fails closed on database errors).
- **No SQL injection**: all 13 `pool.query` call sites use `$n` placeholders; the only dynamic SQL fragment is a constant.
- **`next@16.3.8` is not affected by CVE-2025-29927**, and no `middleware.ts` exists, so the header-bypass path is absent. Authorization lives in the Express route handlers regardless.
- **No stack traces or database details reach the browser**: the global handler returns `{ "error": "Internal server error" }`.
- **No secrets in git history**: `gitleaks git -v` → 31 commits, no leaks.

## Owner steps completed

1. ✅ Production admin password rotated, old default disabled (F1).
2. ✅ Database migration applied to production, PR #10 merged and live (F2, F3).
3. ⏳ Optionally delete the dormant `api/**` backend — F14.
