'use client';

import { PostHogProvider } from '@posthog/react';
import posthog from 'posthog-js';

export default function AnalyticsProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
