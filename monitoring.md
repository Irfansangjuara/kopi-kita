# Kopi Kita — Monitoring (Module 2)

Production: <https://kopikita.copilotmarketing.id> · Health: <https://kopikita.copilotmarketing.id/api/health>

| Question | Tool | Where |
| :---- | :---- | :---- |
| What error happened, on which line? | Sentry (project `kopi-kita`, org `kopikita`) | <https://kopikita.sentry.io> |
| How fast do pages feel? | Vercel Speed Insights | Vercel project `kopi-kita` |
| How many visitors, from which pages? | Vercel Web Analytics | Vercel project `kopi-kita` |
| Are the site and database alive? | Sentry Uptime monitor + `/api/health` | <https://kopikita.sentry.io/organizations/kopikita/monitors/uptime/> |
| Which queries are slow? (optional) | Neon Monitoring | not done |

## Error-to-fix flow (the practice bug)

- Practice bug lives only on branch `chore/bug-latihan-sentry` (commit "chore: seat online bookings from the seating chart"). `git log main --grep="seating chart"` is empty: the bug never reached `main` or production.
- Preview: `POST /api/bookings` with `party_size: 2` -> 201, with `party_size: 5` -> 500, which raised Sentry issue **KOPI-KITA-5**, `TypeError: Cannot read properties of undefined (reading 'capacity')`, environment `preview`, transaction `POST /api/[...slug]`, with a source-mapped frame at `kopi-kita/./src/server/routes/bookings.ts:39` (<https://kopikita.sentry.io/issues/7780497042/>).
- Fix PR: <https://github.com/Irfansangjuara/kopi-kita/pull/1> (branch `fix/booking-error`, mentions KOPI-KITA-5, merged into `main`). The fix removes the incomplete seat-chart lookup and validates `party_size > 4` with a 400 plus a clear message; the booking form was aligned (`max={4}`). Nothing is wrapped in `try/catch` to hide the failure.
- After the fix: preview `party_size: 5` -> 400 `Online bookings are limited to 4 guests...`, `party_size: 3` -> 201; production `party_size: 5` -> 400, `party_size: 2` -> 201. Issue KOPI-KITA-5 is **resolved** and still shows `count: 1` (no new events after the fix). Screenshot: `docs/evidence/sentry-issue-booking-500.png`.

## Two infrastructure bugs found while wiring this up (fixed on `main`)

1. **Server errors never reached Sentry.** Express routes catch their own errors, so Next.js' `onRequestError` hook never fires for `/api/*`, and `Sentry.captureException` had no client. Fixed with `src/server/observability.ts` (`reportServerError` + `Sentry.flush(2000)` before the response, because serverless functions freeze right after responding) and by wiring it into every Express catch block.
2. **`instrumentation.ts` was never loaded.** With an `src/` layout Next.js only picks up `src/instrumentation.ts`; the file sat at the repository root, so the server SDK was never initialized (verified with a temporary probe route: `hasClient: false` before the move, `hasClient: true` after). File moved to `src/instrumentation.ts`.

## Production health

 - `GET /api/health` runs `SELECT 1` on the existing pool, always re-runs (`dynamic = 'force-dynamic'`, `no-store`), answers `{"status":"ok"}` with 200, or `{"status":"error"}` with 503 without exposing error details or the connection string.
 - Uptime monitor `10574554` "Kopi Kita production health" -> `https://kopikita.copilotmarketing.id/api/health`, every 5 minutes, currently active and up.
 - Alert proof: a second monitor pointed at `/api/health-does-not-exist` on purpose; it went down and Sentry raised **KOPI-KITA-2** ("Downtime detected..."). That temporary monitor was deleted after the proof (202). The alert email lands in the owner's inbox: **screenshot still to be attached by the owner**.
 - Sentry alerting: org detectors "Error Monitor" and "Issue Stream: All Projects" are enabled, so new high-priority issues notify the account owner by email.

## Known open defect (visible in Sentry, not yet fixed)

**KOPI-KITA-4** — `TypeError: Cannot read properties of undefined (reading 'removeListener')`.
Reproduce: `curl -X POST -H 'Content-Type: application/json' --data '{bad json' https://kopikita.copilotmarketing.id/api/bookings`. Express' JSON parser errors, the request stream is destroyed, and the fake `IncomingMessage` in `src/app/api/[...slug]/route.ts` crashes the function (Vercel log: "Node.js process exited with exit status: 129") after the 500 response. Left unresolved on purpose: it is a separate adapter defect, not part of the practice-bug exercise.

## Environment variables

- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST` (production + preview).
- `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG=kopikita`, `SENTRY_PROJECT=kopi-kita` (production + preview). The auth token is used only at build time for source maps; no token, DSN or connection string is committed to the repository (`.env.local` is git-ignored, `.env.example` holds empty placeholders).

## Evidence files

`docs/evidence/`: PostHog dashboard, funnel, feature flag, Sentry issue list, the resolved KOPI-KITA-5 issue, uptime monitor, Vercel Speed Insights, and Vercel Observability. Still missing: the alert email screenshot (owner).
