# Kopi Kita — Threat Model (1 page)

*Companion files: `security/owasp-map.md` (evidence per OWASP category), `security/npm-audit.md`, `security/gitleaks-output.txt`. Scope: `security/scope.md`.*

## 1. Assets (what is worth guarding)

| Asset | Why it matters |
| :---- | :---- |
| Booking data (`bookings` table: customer name, WhatsApp number, notes) | Personal data under the UU PDP (Law 27/2022); the data controller is responsible if it leaks |
| Admin account + session cookie | Full control of the CMS and read access to every booking |
| `DATABASE_URL` and other secrets (Vercel env, Sentry auth token, PostHog key) | The connection string opens the whole database |
| Menu & price integrity | Visitors must never be able to change prices or delete menu items |

## 2. Entry points (doors an outsider can knock on)

- Public forms: `POST /api/bookings`, `GET /api/products` (+ `?category=`), `/menu`, `/booking`
- Admin API: `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `GET /api/bookings`, `PATCH /api/bookings/:id`, `POST|PUT|DELETE /api/products`
- Admin pages: `/admin/login`, `/admin`, `/admin/products`, `/admin/bookings` (client-side redirect only; data comes from the gated API)
- The git repository itself (public history) and the npm dependency tree (other people's code running inside the app)

## 3. Threats and mitigations

| # | Threat | Asset | OWASP 2025 | Mitigation | Priority |
| :-- | :---- | :---- | :---- | :---- | :---- |
| T1 | Default admin password (`kopikita-admin`) shipped in `seed.sql` and printed on the login page — anyone who finds it owns the CMS | Admin account, all data | A07, A08 | Change the production password now; remove the demo-credentials hint from `/admin/login`; keep only a hashed credential in the DB | **High** |
| T2 | Online brute force / credential stuffing on the only admin account, invisible because failures are never logged | Admin account | A06, A07, A09 | `login_attempts` table + 429 after 5 failed attempts per (email, IP) in 15 min; log failures through Sentry (Module 4 PR) | **High** |
| T3 | A future route is added without `requireAdmin`, or the fence lives only in middleware/client (the CVE-2025-29927 lesson) | Menu, bookings | A01 | Auth stays in the Express route handlers (`requireAdmin` on every mutation); CI check that admin endpoints answer 401 without a cookie; `next` 16.3.8 is outside the CVE range | **High** |
| T4 | Vulnerable dependency or a malicious/outdated package in the tree | Whole app | A03, A08 | `npm audit` in CI (0 findings in production deps), Dependabot alerts + weekly `dependabot.yml`, committed lockfile | Medium |
| T5 | Secret committed to git history (a connection string that once slipped into a seed file) | Database, tokens | A02, A03 | `.env*` git-ignored (except `.env.example` placeholders), `gitleaks git -v` in the autopilot on every PR; rotate-first policy if a real leak appears | Medium |
| T6 | No security headers / CSP: a single XSS or third-party script owns the session-less browsing context | Visitors, admin pages | A02 | `headers()` in `next.config.ts` (HSTS, nosniff, DENY, Referrer-Policy, Permissions-Policy, CSP) + `poweredByHeader: false`; verified by securityheaders.com before/after (Module 4 PR) | Medium |
| T7 | Session token stored raw, logout swallows DB errors, bad input answered as 500 | Sessions, integrity | A04, A10 | Store a hash of the session id instead of the raw token; keep failing closed; return 400 for bad input and log the error to Sentry | Medium |
| T8 | Unauthenticated `POST /api/bookings` has no abuse control: fake reservations flood the table and the connection pool | Booking data, availability | A06, A10 | Per-IP throttle for the booking endpoint, input length caps, monitor volume in Sentry/uptime | Low |

## 4. Residual risk (accepted for now, on purpose)

- **No CAPTCHA or phone verification on booking.** Volume is tiny (a single café) and every booking is confirmed by a human before it matters; T8 keeps the throttle and the monitoring instead.
- **No 2FA for the admin account.** One user, rate limiting added (T2), password rotated (T1). Revisit if a second admin appears.
- **Admin pages still redirect client-side.** Accepted because the API behind them enforces the session; the data never renders without it.
- **5 high npm advisories stay open (dev-only).** They sit in the `eslint-config-next → fast-glob → micromatch → braces` chain, never load in production, and the only "fix" npm offers is a downgrade to Next 14. Dependabot tracks them.
- **`next dev` cannot run from this checkout's directory** (the path contains `#`, which both bundlers truncate). Verification happens on Vercel previews and in CI instead; it does not affect the deployed product.
