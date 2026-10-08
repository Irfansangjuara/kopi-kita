# Kopi Kita Monitoring

## Implemented in the repository

- Sentry browser initialization is merged into `instrumentation-client.ts` without removing the existing PostHog initialization.
- Sentry server and Edge initialization live in `sentry.server.config.ts` and `sentry.edge.config.ts`.
- `instrumentation.ts` exports `onRequestError` for server-side request errors.
- `src/app/global-error.tsx` captures unhandled client render errors.
- `src/app/sentry-example-page/page.tsx` provides a controlled test error.
- `next.config.ts` uses Sentry's `withSentryConfig` with the `/monitoring` tunnel route.
- Vercel Analytics and Speed Insights are rendered from `src/app/layout.tsx`.
- `GET /api/health` runs `SELECT 1` and returns only `{ "status": "ok" }` or `{ "status": "error" }`.

## Production health URL

`/api/health`

The endpoint is public, dynamic, and sends `Cache-Control: no-store`. Database errors return HTTP 503 without exposing error details or connection settings.

## Required environment variables

- `NEXT_PUBLIC_SENTRY_DSN`: Sentry DSN used by browser, server, and Edge runtimes.
- `SENTRY_AUTH_TOKEN`: Vercel build-time token for source-map upload. Keep it in Vercel Environment Variables; never commit its value.
- `SENTRY_ORG` and `SENTRY_PROJECT`: Sentry build metadata if required by the selected Sentry project setup.

## External evidence still required

The repository cannot create third-party accounts, deploy to Vercel, or produce real dashboard screenshots. After adding the Sentry DSN and build variables, deployment must supply these real evidence items:

1. Sentry test issue with a readable source-mapped stack trace.
2. A fix PR linked to the deliberately created preview-only bug, followed by a resolved Sentry issue.
3. Production `/api/health` URL returning `{ "status": "ok" }`.
4. Green UptimeRobot or Sentry uptime monitor screenshot.
5. Alert email screenshot from the temporary failing monitor.
6. Vercel Speed Insights or Observability screenshot.

No Sentry token, DSN, database connection string, or personal visitor data is stored in this document.
