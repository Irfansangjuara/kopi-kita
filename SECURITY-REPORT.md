# SECURITY-REPORT.md — Kopi Kita

*Autopilot security report for the Kopi Kita project (Modules 1–5). Companion documents: `tracking-plan.md` (analytics), `monitoring.md` (Sentry/uptime), `security/scope.md`, `security/threat-model.md`, `security/temuan-w2m4.md` (findings as they are worked), `security/npm-audit.md`.*

## 1. Executive summary

Kopi Kita is a coffee-shop site with a public menu, a table-booking form, and a small admin CMS; it runs on Vercel with a Neon Postgres database. A GitHub Actions autopilot now checks the project on every pull request and every week for vulnerable dependencies, leaked secrets, insecure code patterns, web-application weaknesses and page quality, and every result is stored as a pipeline artifact. The findings below are triaged by an AI agent and fixed through small pull requests that a human reviews and merges.

## 2. Product & Data

| | |
| :---- | :---- |
| **What it does today** | Public menu (`/menu`), table booking (`/booking` → `POST /api/bookings`), admin CMS (`/admin` → products + bookings, login at `/admin/login`). Next.js 16 App Router front end, Express API mounted through one catch-all route, Postgres for products, bookings, admins and sessions. |
| **Booking completion metric** | *"at least 30% of visitors who start the booking form submit it"* (`booking_submitted / booking_started`, 7 days) — measured on 2026-10-08: 1 → 1 = **100%**, so the target is reached but the sample is a single developer test session, not a real reading. Insight: <https://us.posthog.com/project/652575/insights/a1bQ2k97> · dashboard: <https://us.posthog.com/project/652575/dashboard/2184994> |
| **`cta-landing` flag** | Active multivariate flag, control ("Booking Meja") / test ("Reserve Your Table") 50/50. Exposures so far: 1 × `test`, 1 unresolved, `control` never served, `cta_clicked` = 0 — no experiment signal yet. |
| **Sentry** | Project `kopi-kita` (org `kopikita`); source maps upload on every deploy. Module 2's practice bug (issue **KOPI-KITA-5**) is resolved with no later events. Open: **KOPI-KITA-4** (malformed JSON on the API bridge kills the serverless function). |
| **Uptime** | Monitor "Kopi Kita production health" on <https://kopikita.copilotmarketing.id/api/health>, every 5 minutes, currently up. The alert path was proven by a deliberately failing monitor (issue **KOPI-KITA-2**), since deleted. |
| **Vercel Analytics + Speed Insights** | Enabled and receiving data; Security headers are served on every route. |

## 3. Scope

My own Kopi Kita app and repository (<https://github.com/Irfansangjuara/kopi-kita>). Dynamic scans run **only** against a build started inside the CI runner at `http://localhost:3000`; production `*.vercel.app` URLs are never scanned, and neither is anyone else's system. Full statement, signed: `security/scope.md` (PDF: `security/scope.pdf`).

## 4. Methodology

| Inspector | Tool | When it runs | Data it touches |
| :---- | :---- | :---- | :---- |
| `deps` | `npm audit --json` | every PR, weekly, manual | repo + lockfile |
| `secrets` | gitleaks-action (full history, `fetch-depth: 0`) | every PR, weekly, manual | git history |
| `sast` | Semgrep CE (`p/react`, `p/typescript`, `p/owasp-top-ten`) | every PR, weekly, manual | source |
| `dast` | OWASP ZAP baseline (passive crawl) | every PR, weekly, manual | local build + throwaway Postgres container with seed data |
| `quality` | Lighthouse CI (performance ≥ 0.7, accessibility ≥ 0.8) | every PR, weekly, manual | local build + CI-only Neon `ci` branch |
| `agent` | Claude-Code-style review + triage | on demand | source, artifacts |

Workflow: `.github/workflows/autopilot.yml` (jobs `deps`, `secrets`, `sast`, `dast`, `quality`, artifacts per job). Config: `lighthouserc.json`, `.zap/rules.tsv`. The AI agent reads the artifacts, maps findings to OWASP Top 10:2025, proposes priorities, and opens one small fix PR per finding; a human reviews and merges, then the same scanner proves the finding is gone.

### Where the agent was wrong (and how it was caught)

1. **It read a replay wrong.** From the metadata of a 317-second recording it concluded "the visitor idled, the landing page does not hold attention". Querying which URLs that session actually visited showed it was the deliberate Sentry error-page test — the page has no next step, so idling is expected. The finding was rewritten; the real finding from that session is about the error screen being a dead end.
2. **It broke its own pipeline.** Setting `NODE_ENV: production` at job level made `npm ci` skip devDependencies, so `typescript` was missing, Next never detected the project as TypeScript, the `@/*` tsconfig paths were ignored and the build failed on 8 module-not-found errors. Reproduced locally in one command (`NODE_ENV=production npm ci` → 211 packages, no typescript; plain `npm ci` → 507 packages), fixed with `--include=dev`, and the reason is now a comment in the workflow.
3. **One earlier wiring miss.** The server Sentry SDK was never initialised because `instrumentation.ts` sat at the repository root while the app lives under `src/` (Next only loads `src/instrumentation.ts` there). A throwaway probe route reporting `hasClient: false` proved it, and the same probe returned `true` after the file moved.
4. **It refused to fabricate.** Asked to "fill in the funnel with sample data" for the Module 1 checkpoint, it declined: that checkpoint asks for at least five *real* people, and synthetic sessions are easy to spot (one device, identical user agents, events seconds apart). Instead it produced a tester pack (WhatsApp text + QR code) and a labelled demo option, and left the funnel honest.


## 5. Findings

The live table is `security/temuan-w2m4.md` (ID, source, OWASP 2025 category, location, priority, status, PR). Current state:

| Priority | Open | Fixed / Accepted |
| :---- | :---- | :---- |
| High | — | F1 demo credentials (fixed in code by PR #9; production password rotation is an owner step), F2 login throttling (PR #10, pending the DB change) |
| Medium | F5 (logout keeps a session on a DB error), F7 (booking input validation), F8 (product input validation), M2-1 (API bridge crash) | F3 failed-login logging, F6 + F12 session cookie flags, F9 headers + CSP, S3 pinned action SHAs, Z3 cross-origin headers |
| Low | F10 (`:id` validation), F11 (expired sessions), F14 (dormant `api/` backend), F16 (GET with body → 500) | S1/S2 Dependabot cooldown |
| Accepted (reason written in `security/temuan-w2m4.md`) | F4 (client-only `/admin` gate — the API enforces), F13 (public health endpoint — needed by the uptime monitor), F15 (5 dev-only npm advisories), Z1 (CSP `'unsafe-inline'` — a nonce CSP needs dynamic rendering), Z2 (COEP `require-corp` — would break PostHog assets), Z4 (ZAP informational), Z5 (`?category=` allow-listed + parameterised) | — |

New findings raised by the autopilot's first runs (npm audit, gitleaks, Semgrep, ZAP) are merged into the same table; the raw ZAP/Lighthouse numbers are in section 8 and in the artifacts of each run.

## 6. Proof of fixes

| Finding | PR | Verification |
| :---- | :---- | :---- |
| F9 missing security headers | [#3](https://github.com/Irfansangjuara/kopi-kita/pull/3) | securityheaders.com **D → A** (`SS Tugas Modul 4/01-…`, `02-…`), headers present on production (`curl -I`), no CSP violations in the browser console on `/`, `/menu`, `/booking`, `/admin/login`, PostHog still ingesting (15 `$pageview` in the 30 minutes after the merge) |
| F1 demo credentials advertised | [#9](https://github.com/Irfansangjuara/kopi-kita/pull/9) | `curl -s https://kopikita.copilotmarketing.id/admin/login \| grep -c kopikita-admin` → `0`; the production password rotation is still an owner step |
| S1/S2 Dependabot without cooldown | [#2](https://github.com/Irfansangjuara/kopi-kita/pull/2) | Semgrep rescan on the same config → 2 findings → **0** |
| F2/F3 login throttling + logging | [#10](https://github.com/Irfansangjuara/kopi-kita/pull/10) (open, migration first) | local production build: five `401` then `429`; correct password after clearing the counter → `200` and the counter resets; `[security] failed admin login key=…` in the server log |
| F6/F12 cookie flags | [#3](https://github.com/Irfansangjuara/kopi-kita/pull/3) | `Set-Cookie: sessionId=…; Max-Age=604800; Path=/; HttpOnly; Secure; SameSite=Lax` on the local production build |
| Access control (F4 assessment) | — | every admin endpoint answers `401` without a cookie: `GET /api/bookings`, `PATCH /api/bookings/:id`, `POST/PUT/DELETE /api/products/:id` |
| S3 mutable action tags (13 Semgrep findings) | [#12](https://github.com/Irfansangjuara/kopi-kita/pull/12) | the `sast` artifact of that PR's run reports **0** findings, down from 13 (`scan-results/semgrep/semgrep.json` → empty `results`) |
| Z3 cross-origin headers + accepted ZAP alerts | [#13](https://github.com/Irfansangjuara/kopi-kita/pull/13) | the `dast` job of run [#37746418344](https://github.com/Irfansangjuara/kopi-kita/actions/runs/37746418344) is **green**: ZAP alerts 10 → 8, the two COOP/CORP alerts fixed, the rest accepted with a reason in `.zap/rules.tsv` |

## 7. Accepted risks

- **F4 — `/admin/**` pages gate in the client only.** The data behind them is protected server-side by `requireAdmin` on every endpoint, so an unauthenticated visitor sees an empty shell, not data. Recorded in `security/threat-model.md`.
- **F13 — the public health endpoint reveals database reachability.** That is exactly its job for the uptime monitor; it leaks no details.
- **F15 — 5 high npm advisories in the dev toolchain.** Never shipped to the runtime; npm's only "fix" would downgrade Next to 14. Dependabot tracks them.
- **No CAPTCHA or 2FA.** One admin user, a small café: login throttling (F2) plus the promised password rotation are the proportionate controls today.
- **`next dev` cannot run from this checkout** (the folder path contains `#`, which both bundlers truncate). Development and verification happen in a clean-path copy, on Vercel previews, and in CI; the deployed product is unaffected.

## 8. Before / after

| Measure | Before | After |
| :---- | :---- | :---- |
| securityheaders.com grade | **D** (missing X-Content-Type-Options, Referrer-Policy, Permissions-Policy) | **A** |
| npm audit — production dependencies | 0 findings | 0 findings |
| npm audit — all dependencies | 5 high (dev-only chain) | 5 high (dev-only, accepted) — 5 Dependabot PRs opened |
| Semgrep (repo) | 2 findings (`dependabot-missing-cooldown`) | 0 findings |
| gitleaks (git history) | 31 commits scanned → no leaks | no leaks |
| ZAP baseline (localhost, passive) | 10 alerts — 2 CSP `unsafe-inline`, 3 cross-origin, 5 informational → `dast` red | 8 alerts — COOP/CORP fixed, the rest accepted with a written reason in `.zap/rules.tsv` → `dast` **green** |
| Lighthouse (median of 3 runs) | — | `/` performance **0.83** / accessibility **0.91** · `/menu` **0.86** / **0.96** · `/booking` **0.84** / **0.96** (thresholds 0.7 / 0.8) |
| Autopilot runs | [#1](https://github.com/Irfansangjuara/kopi-kita/actions/runs/37745017368) first switch-on: deps/secrets/sast green, dast + quality red (CI build failed: `NODE_ENV=production` made `npm ci` skip devDependencies, so Next never saw `typescript` and ignored the `@/*` tsconfig paths) · [#2](https://github.com/Irfansangjuara/kopi-kita/actions/runs/37745564686) after `--include=dev`: dast red on 10 real ZAP alerts | [#37746418344](https://github.com/Irfansangjuara/kopi-kita/actions/runs/37746418344) **all five jobs green** (deps, secrets, sast, dast, quality) |

## 9. Next steps

1. **Finish the open owner steps:** rotate the production admin password, apply `src/server/db/changes/001-login-attempts.sql` to production and merge PR #10, and set the CI-only Neon `ci` branch URL as the `DATABASE_URL` repository secret so the Lighthouse baseline can run.
2. **Fix the API-bridge exceptional conditions (M2-1, F16):** a malformed JSON body currently answers 500 and kills the function, and a GET carrying a body answers 500 too — both are one adapter defect in `src/app/api/[...slug]/route.ts` and both would be caught by the pipeline after the fix.
3. **Grow from "not broken" to "better":** validate booking/product input server-side (F7/F8), purge expired sessions (F11), then tighten the Lighthouse thresholds (performance ≥ 0.85, accessibility ≥ 0.95) and add an abuse limit to the public booking endpoint.
