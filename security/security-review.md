# Security Review — Kopi Kita

**Date:** 2026-10-08
**Scope:** `src/server/**`, `src/app/api/**`, `src/app/admin/**` (Next.js 16 App Router + Express API mounted via the catch-all route).
**Method:** static read-only review of source. No builds, dev servers, or scanners were executed. Every finding is anchored to a real `file:line`; items I could not confirm from code are marked **needs verification**.
**Excluded (mentioned only as informational):** the legacy standalone backend under `api/**` (not mounted by the Next app), and `src/app/(site)/**`.

---

## 1. Access-control inventory (every API endpoint + every `/admin/**` page)

Routing model: Next.js exposes **no** `middleware.ts` in this repo. All `/api/*` requests flow through the catch-all bridge `src/app/api/[...slug]/route.ts:81-85`, which forwards verbatim to the Express app (`src/server/app.ts:21-23`). Therefore all server-side authorization is enforced by Express (`requireAdmin`, `src/server/middleware/auth.ts:18`).

### API endpoints

| # | Method + path | Source (file:line) | Where the login/role check happens | Gate quality |
|---|---|---|---|---|
| 1 | `ANY /api/*` (bridge) | `src/app/api/[...slug]/route.ts:77`, exports `:81-85` | None at the bridge; delegates to Express | Neutral (pass-through) |
| 2 | `GET /api/health` | `src/app/api/health/route.ts:10` | None — deliberately public; runs `SELECT 1` (`:11`) | Public by design (see Finding 13) |
| 3 | `POST /api/auth/login` | `src/server/routes/auth.ts:12` | None (credential check only, `:22-33`) | Intended public; **no rate limit** (Finding 2) |
| 4 | `POST /api/auth/logout` | `src/server/routes/auth.ts:60` | None — deletes whatever session cookie is presented (`:65`) | Acceptable, but error swallowed (Finding 5) |
| 5 | `GET /api/auth/me` | `src/server/routes/auth.ts:76` | Inline session lookup (`:85-99`), same SQL as `requireAdmin` but **not** the middleware | Server-side ✔ (handler-local) |
| 6 | `GET /api/products` | `src/server/routes/products.ts:9` | None — public menu listing | Public by design |
| 7 | `POST /api/products` | `src/server/routes/products.ts:32` | `requireAdmin` (Express middleware, `:32`) | Server-side ✔ |
| 8 | `PUT /api/products/:id` | `src/server/routes/products.ts:67` | `requireAdmin` (Express middleware, `:67`) | Server-side ✔ |
| 9 | `DELETE /api/products/:id` | `src/server/routes/products.ts:109` | `requireAdmin` (Express middleware, `:109`) | Server-side ✔ |
| 10 | `POST /api/bookings` | `src/server/routes/bookings.ts:9` | None — public booking form | Public by design |
| 11 | `GET /api/bookings` | `src/server/routes/bookings.ts:70` | `requireAdmin` (Express middleware, `:70`) | Server-side ✔ |
| 12 | `PATCH /api/bookings/:id` | `src/server/routes/bookings.ts:84` | `requireAdmin` (Express middleware, `:84`) | Server-side ✔ |

`requireAdmin` implementation: `src/server/middleware/auth.ts:18-55`. It requires the `sessionId` cookie (`:23`), performs a DB lookup joining `sessions`→`admins` with `expires_at > NOW()` (`:32-40`), returns 401 on miss (`:41-44`) and **fails closed** on DB error (`:51-54`).

### Admin pages

| Page | Source | Server-side gate | Client-side gate |
|---|---|---|---|
| `/admin` (dashboard) | `src/app/admin/page.tsx:11` | **None** | `apiFetch('/api/auth/me')` in `useEffect`, redirect on failure (`:21-24`) — **client only** |
| `/admin/products` | `src/app/admin/products/page.tsx:17` | **None** | Same pattern (`:27-30`) — **client only** |
| `/admin/bookings` | `src/app/admin/bookings/page.tsx:19` | **None** | Same pattern (`:28-31`) — **client only** |
| `/admin/login` | `src/app/admin/login/page.tsx` | None | N/A — public by design |
| `/admin` layout (shared shell) | `src/app/admin/layout.tsx:8` | **None** | None — sidebar/logout only (`:13-22`) |

**Flags:**
- Endpoints whose only gate is the client: **none** — every state-changing/product/booking endpoint is protected by `requireAdmin` server-side.
- **Pages whose only gate is the client: all three `/admin/**` data pages, and the layout has no gate at all** (Finding 4).
- No endpoint relies on Next.js middleware (there is no `middleware.ts`), so the CVE-2025-29927 bypass surface does not exist in this codebase.

---

## 2. `next` version vs CVE-2025-29927

| Item | Value |
|---|---|
| Installed version | `next@16.3.8` (`package.json:20`), pinned exactly (no `^`) |
| Vulnerable ranges per advisory | `12.x < 12.3.5`, `13.x < 13.5.9`, `14.x < 14.2.25`, `15.x < 15.2.3` |
| Result | **NOT affected.** `16.3.8` is a major version above the fixed `15.2.3` and falls outside all listed vulnerable ranges. |

Additional mitigation depth: even if a vulnerable version were installed, the exploit path (forging `x-middleware-subrequest` to skip authorization in Next.js `middleware.ts`) is **not present** — the repo contains no `middleware.ts` (`find` over the project found none) and authorization lives entirely in the Express layer. Note that the bridge forwards all incoming headers verbatim, including any `x-middleware-subrequest` (`src/app/api/[...slug]/route.ts:21-22, 35`); this is harmless here because no auth decision reads that header, but it is worth remembering if middleware is ever introduced.

**"needs verification":** the version string is whatever the task/repo pins; confirm against `npm ls next` in CI. `security/npm-audit-raw.json` (pre-existing artifact) does **not** list `next` as vulnerable.

---

## 3. SQL-injection review (all `pool.query` call sites)

Every query uses positional placeholders (`$1…$n`) with a parameters array. Dynamic SQL is built only from a **constant** fragment, never from user input.

| Call site | Query shape | Verdict |
|---|---|---|
| `src/server/middleware/auth.ts:32-40` | `... WHERE s.id = $1` | Parameterized ✔ |
| `src/server/routes/auth.ts:22` | `SELECT * FROM admins WHERE email = $1` | Parameterized ✔ |
| `src/server/routes/auth.ts:39-42` | `INSERT INTO sessions ... VALUES ($1,$2,$3)` | Parameterized ✔ |
| `src/server/routes/auth.ts:65` | `DELETE FROM sessions WHERE id = $1` | Parameterized ✔ |
| `src/server/routes/auth.ts:85-92` | `... WHERE s.id = $1` | Parameterized ✔ |
| `src/server/routes/products.ts:14, 19, 23` | `SELECT * FROM products` + constant `" WHERE category = $1"` appended; value pushed to `params` | Parameterized ✔ (no concatenation of user data) |
| `src/server/routes/products.ts:53-59` | `INSERT ... VALUES ($1..$6)` | Parameterized ✔ |
| `src/server/routes/products.ts:89-96` | `UPDATE products SET ... WHERE id = $7` | Parameterized ✔ |
| `src/server/routes/products.ts:113` | `DELETE FROM products WHERE id = $1` | Parameterized ✔ |
| `src/server/routes/bookings.ts:55-60` | `INSERT ... VALUES ($1..$6)` | Parameterized ✔ |
| `src/server/routes/bookings.ts:73-75` | `SELECT * FROM bookings ORDER BY booking_date, booking_time` (no input interpolated) | Safe ✔ |
| `src/server/routes/bookings.ts:101-104` | `UPDATE bookings SET status = $1 WHERE id = $2` | Parameterized ✔ |
| `src/app/api/health/route.ts:11` | `SELECT 1` (static) | Safe ✔ |

**Result: no SQL-injection findings.** The residual issue is type confusion on unvalidated `:id` values (Finding 10), which causes DB cast errors rather than injection.

---

## 4. Error-handling review (fail-open / information disclosure)

- Global Express error handler returns a generic `{ error: 'Internal server error' }` with status 500 and never serializes `err.stack` (`src/server/app.ts:31-41`). ✔ No stack-trace/DB-detail leakage.
- Every route `catch` calls `reportServerError` (server-side logs/Sentry only: `src/server/observability.ts:15-18`) and responds with a generic message (`auth.ts:53-56`, `products.ts:26-28`, `bookings.ts:63-65`, etc.). ✔ No `next(err)` **fail-open** path exists; `requireAdmin` fails **closed** (`middleware/auth.ts:51-54`).
- **Exception:** `logout` deliberately swallows a DB failure and still returns 204 (`src/server/routes/auth.ts:66-69, 72`) → Finding 5.
- The catch-all bridge never handles a synchronous throw / never-`end` case: `new Promise` at `src/app/api/[...slug]/route.ts:39-78` only settles from `nodeRes.end()` (`:66-77`); a throw before `app(nodeReq, nodeRes)` (`:77`) or an Express path that never ends would leave the request hanging. Not fail-open, but an availability edge case. **needs verification** (not reproduced; no runtime test allowed).
- `console.error` of raw errors includes whatever the driver emits; the JSDoc at `observability.ts:13` states the intent to keep bodies/PII out. Compliance with that intent is **needs verification** per call site.

---

## 5. Session cookie review

Set at login — `src/server/routes/auth.ts:44-50`:

| Attribute | Value | Assessment |
|---|---|---|
| `httpOnly` | `true` (`:45`) | ✔ not readable by JS |
| `secure` | `process.env.NODE_ENV === 'production'` (`:46`) | Conditional only — Finding 6 |
| `sameSite` | `'lax'` (`:48`) | ✔ blocks cross-site POST/PUT/PATCH/DELETE (basic CSRF mitigation); no CSRF token anywhere (`src/lib/api.ts:16-26` sends `credentials: 'include'`) |
| `path` | `'/'` (`:49`) | ✔ |
| `maxAge` | 7 days (`:47`) | Matches DB `expires_at` computed at `auth.ts:37` = `now + 7d` ✔ |

- Cookie value is `randomBytes(32).toString('hex')` (`auth.ts:36`) — 256-bit, no fixation risk.
- Cleared at logout with `res.clearCookie('sessionId', { path: '/' })` (`auth.ts:71`) — path matches so deletion works, but `secure`/`sameSite`/`httpOnly` from the set call (`:45-48`) are not mirrored → Finding 12.
- Server-side validity is enforced on every protected read via `expires_at > NOW()` (Finding 11 covers never purging expired rows).

---

## 6. Input-validation review (endpoints accepting a body)

| Endpoint | Validation present | Gaps |
|---|---|---|
| `POST /api/auth/login` (`auth.ts:12-34`) | Presence of `email`/`password` (`:17-20`); bcrypt compare (`:29`) | No max length; no format check. Low risk (bcryptjs truncates at 72 bytes) |
| `POST /api/products` (`products.ts:32-61`) | Presence of `name`/`price`/`category` (`:40-43`), category allow-list (`:44-47`), `Number(price) < 0` (`:48-51`) | `price` not required to be an integer (raw value passed to an `INTEGER` column at `:57`); `description`/`name` length uncapped vs `VARCHAR(255)`; `image_url` not validated as a URL → Finding 8 |
| `PUT /api/products/:id` (`products.ts:67-101`) | Same as POST (`:75-86`) | Same gaps; `:95` passes raw `price` |
| `POST /api/bookings` (`bookings.ts:9-61`) | Presence (`:18-23`), `party_size` integer 1–8 (`:25-29`), ≤4 online (`:33-38`), date not past (`:43-46`), WhatsApp ≥10 digits (`:49-53`) | `booking_time` is unvalidated free text into `VARCHAR(10)`; `customer_name` length uncapped vs `VARCHAR(255)`; `notes` unbounded → Finding 7 |
| `PATCH /api/bookings/:id` (`bookings.ts:84-110`) | Presence + status allow-list (`:90-99`) | ✔ None material |
| `DELETE /api/products/:id`, `PUT /api/products/:id` | — | `:id` not validated as integer → Finding 10 |

Also note: field names in the JSON body are destructured explicitly (no mass-assignment into SQL), which is good.

---

## 7. Login rate limiting / brute-force protection

**Absent.** `POST /api/auth/login` (`src/server/routes/auth.ts:12-57`) processes unlimited attempts; there is no `express-rate-limit`, no counter, no lockout, no CAPTCHA, and no artificial delay anywhere in `src/server/**`. Failed attempts (`:23-26`, `:30-33`) return a generic `Invalid credentials` (good: no user enumeration) but are not logged either (`reportServerError` is only reached in the `catch` at `:54`).

---

## 8. Findings (prioritized)

### HIGH

1. **Demo admin credentials shipped in the UI and seeded in the database.**
   `src/app/admin/login/page.tsx:88-89` renders `admin@kopikita.id / kopikita-admin` to every visitor; `src/server/db/seed.sql:26-28` inserts that account with a known bcrypt hash (cost 10).
   *Scenario:* anyone who loads `/admin/login` reads the password and logs in as admin; the same seed is the production bootstrap. *OWASP:* A07:2025 Authentication Failures. *Fix:* delete the demo block and the seed credentials (or gate seeding to non-production + force a password change / unique random password per deploy).

2. **No rate limiting or lockout on the login endpoint.**
   `src/server/routes/auth.ts:12-57`.
   *Scenario:* an attacker brute-forces `POST /api/auth/login` offline-speed (bcrypt cost 10 allows ~dozens/sec/worker) and eventually recovers the admin password; the known demo password makes this trivial. *OWASP:* A07:2025 Authentication Failures. *Fix:* add per-IP + per-account throttling with exponential backoff/lockout and a uniform response delay (e.g. `express-rate-limit` in `src/server/app.ts` before the auth router).

### MEDIUM

3. **Failed logins are not logged or alerted.**
   `src/server/routes/auth.ts:23-26, 30-33` return 401 with no log; `observability.ts` is only reached from `catch` (`:53-56`).
   *Scenario:* brute-force or credential-stuffing against the admin is undetectable — no signal in Sentry/Vercel logs. *OWASP:* A09:2025 Security Logging and Alerting Failures. *Fix:* log/alert (email + IP + attempt count) on failed admin logins without logging the password.

4. **`/admin/**` pages are gated only in the client; the layout has no gate at all.**
   `src/app/admin/page.tsx:21-24`, `src/app/admin/products/page.tsx:27-30`, `src/app/admin/bookings/page.tsx:28-31`, `src/app/admin/layout.tsx:8` (no check); no Next.js `middleware.ts` exists.
   *Scenario:* an unauthenticated visitor renders the full admin shell and any static content before the redirect; data is still safe because every data endpoint re-checks via `requireAdmin`, but the UI is exposed and any future server-rendered data fetch on these pages would be unprotected. *OWASP:* A01:2025 Broken Access Control. *Fix:* add a server-side gate — a Next.js `middleware.ts` (or per-page server component check) that validates the session cookie before rendering `/admin/**` — rather than relying on `useEffect` redirects.

5. **Logout can leave a valid server-side session when the DB delete fails.**
   `src/server/routes/auth.ts:65-69` swallows the delete error ("best-effort") and `:71-72` still clears the cookie and returns 204.
   *Scenario:* if `DELETE FROM sessions` fails (DB blip/timeout), the client believes it logged out while the session row stays valid for up to 7 days; an attacker holding the stolen cookie keeps access. *OWASP:* A10:2025 Mishandling of Exceptional Conditions (also A07). *Fix:* surface the failure (`5xx`) or retry, and add a sweep of expired sessions so stale rows cannot outlive `expires_at`.

6. **Session cookie `secure` flag depends solely on `NODE_ENV`.**
   `src/server/routes/auth.ts:44-50` (`secure: process.env.NODE_ENV === 'production'`); no `__Host-` prefix; `sameSite: 'lax'`.
   *Scenario:* if `NODE_ENV` is not exactly `production` on the deployed runtime, the session cookie is transmitted over plain HTTP and can be captured by a network attacker. *OWASP:* A02:2025 Security Misconfiguration. *Fix:* force `secure: true` in any deployed environment (explicit env flag), prefer the `__Host-sessionId` name and `sameSite: 'strict'`. **needs verification:** confirm the production `NODE_ENV`.

7. **Booking fields lack length/format validation.**
   `src/server/routes/bookings.ts:12-16` (body), `:18-23` (presence only), `:55-60` (insert).
   *Scenario:* `booking_time` accepts arbitrary strings and `notes`/`customer_name` are unbounded — oversized values bloat the DB and `customer_name` >255 chars raises a PG `22001` error surfaced as a generic 500 (Sentry noise); an out-of-range `booking_time` also corrupts the admin sort order. *OWASP:* A06:2025 Insecure Design. *Fix:* validate `booking_time` against `^([01]\d|2[0-3]):[0-5]\d$` (or a slot allow-list) and cap `customer_name` ≤255 / `notes` ≤1000.

8. **Product input coercion/validation gaps.**
   `src/server/routes/products.ts:35-38, 40-51, 53-57` (POST) and `:70-86, 89-95` (PUT).
   *Scenario:* `price` is only tested with `Number(price) < 0` and the raw value is bound at `:57`/`:95`, so `"abc"` or `1.5` triggers a PG cast error → 500; `image_url` is stored unvalidated, and a non-`images.unsplash.com` URL makes the public menu page's `next/image` throw (`src/components/product-card.tsx:15`, `next.config.ts:10-15`). *OWASP:* A06:2025 Insecure Design. *Fix:* require `Number.isInteger(price) && price >= 0`, validate `image_url` as an `https://` URL on an allow-listed host, and enforce length caps for `name`/`description`.

9. **No security headers / CSP configured.**
   `next.config.ts:4-18` defines only `images.remotePatterns`; there is no `headers()` and no `Content-Security-Policy`/HSTS/`X-Content-Type-Options`/`Referrer-Policy` anywhere in the repo.
   *Scenario:* any future injection sink lacks CSP as a backstop, and the app is framable (clickjacking) subject to host defaults. *OWASP:* A02:2025 Security Misconfiguration. *Fix:* add a `headers()` block (CSP, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`).

### LOW

10. **Path `:id` values are never validated as integers.**
    `src/server/routes/products.ts:67, 109`, `src/server/routes/bookings.ts:84`.
    *Scenario:* `GET`/`DELETE`/`PUT /api/products/abc` (and `/api/bookings/abc`) reach Postgres, which raises a `22P02` cast error → generic 500 instead of 400, and the 404-vs-500 difference can hint at record existence. *OWASP:* A10:2025 Mishandling of Exceptional Conditions. *Fix:* parse with `Number.isInteger(Number(id))` and return 400 early.

11. **Expired sessions are never purged.**
    `src/server/db/schema.sql:36-40` (table) and `:49` (index on `expires_at`) — no cleanup job/statement exists in `src/server/**`.
    *Scenario:* over time the `sessions` table grows without bound (storage/perf), and stale rows remain materialized until an attacker presents them (rejected only because of the `expires_at > NOW()` check). *OWASP:* A06:2025 Insecure Design. *Fix:* periodic `DELETE FROM sessions WHERE expires_at < NOW()` (cron/pg_cron).

12. **`clearCookie` options do not mirror the set options.**
    `src/server/routes/auth.ts:71` clears with only `{ path: '/' }`, while the cookie was set with `httpOnly`/`secure`/`sameSite` (`:44-50`).
    *Scenario:* functionally the deletion works (path/domain match is what counts), but any future change of `path`/`secure`/`sameSite` could silently break logout. *OWASP:* A02:2025 Security Misconfiguration. *Fix:* pass the identical option object to `clearCookie`.

13. **Unauthenticated health endpoint reports DB reachability.**
    `src/app/api/health/route.ts:10-20`.
    *Scenario:* an anonymous caller can probe backend DB availability (`{status:'ok'}` vs 503) for reconnaissance or to amplify load. *OWASP:* A02:2025 Security Misconfiguration. *Fix:* acceptable for uptime checks; optionally restrict to internal probes or drop the DB detail.

---

## 9. Additional observations (informational / out of declared scope)

14. **Legacy standalone backend under `api/**` duplicates the API with weaker controls.**
    `api/src/server.ts:16-17` (its own Express app with `cors({ origin: 'http://localhost:3000' })`) and `:44` (`app.listen(4000)`); `api/src/middleware/auth.ts:16` (in-memory `Map` sessions instead of DB-backed) and `:18-33` (its own `requireAdmin`). This folder is not imported by the Next app, so it is dormant; if ever run/deployed alongside, it would expose a second, differently-authorized surface and lose sessions on restart. **OWASP:** A01/A05. *Priority:* Low, **needs verification** that it is not deployed. *Fix:* delete it or clearly mark it dev-only and remove it from deployment configs.

15. **Transitive dev-dependency advisories recorded in the repo.**
    `security/npm-audit-raw.json` (pre-existing artifact, not re-run here) lists High-severity advisories in transitive dev dependencies — `braces`, `micromatch`, `fast-glob`, surfaced through `@next/eslint-plugin-next` / `eslint-config-next`. These are build/lint-time only, not shipped to the browser runtime. **OWASP:** A03:2025 Software Supply Chain Failures. *Priority:* Low. *Fix:* bump `eslint-config-next` and/or add `overrides` for `braces`/`micromatch`; keep `npm audit` in CI.

---

## 10. Priority summary

| Priority | Findings |
|---|---|
| High | 1 (demo credentials), 2 (no login rate limit) |
| Medium | 3 (no failed-login logging), 4 (client-only `/admin` gate), 5 (logout swallow), 6 (cookie `secure` via NODE_ENV), 7 (booking validation), 8 (product validation), 9 (no security headers) |
| Low | 10 (`:id` validation), 11 (session purge), 12 (`clearCookie` mismatch), 13 (health probe), 14 (legacy `api/`), 15 (dev-dep advisories) |
| Positive / verified-good | All SQL is parameterized (no injection); no stack traces or DB details returned to clients; `requireAdmin` fails closed; login returns a generic error (no user enumeration); `next@16.3.8` is not affected by CVE-2025-29927 and no Next middleware exists to bypass; session tokens are 256-bit random with `httpOnly` and a 7-day server-side expiry that matches the cookie `maxAge`. |
