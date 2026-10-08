import * as Sentry from '@sentry/nextjs';

/**
 * Report an unexpected server error to the console and to Sentry.
 *
 * Express routes in this project catch their own errors, so they never reach
 * Next.js' `onRequestError` hook. Reporting from here keeps API failures in
 * Sentry instead of only in Vercel's runtime logs, which are kept for one hour.
 *
 * The event is flushed before returning: serverless functions are frozen as
 * soon as the response is sent, which would otherwise drop the event.
 *
 * Only pass non-personal context: never request bodies or customer data.
 */
export async function reportServerError(error: unknown, action: string): Promise<void> {
  console.error(`${action}:`, error);
  Sentry.captureException(error, { tags: { action } });
  await Sentry.flush(2000);
}
