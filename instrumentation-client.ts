import * as Sentry from '@sentry/nextjs';
import posthog from 'posthog-js';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tunnel: '/monitoring',
  tracesSampleRate: 0.1,
});

if (
  typeof window !== 'undefined' &&
  projectToken &&
  !window.location.pathname.startsWith('/admin')
) {
  posthog.init(projectToken, {
    api_host: posthogHost,
    defaults: '2026-05-30',
    session_recording: {
      maskAllInputs: true,
    },
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
