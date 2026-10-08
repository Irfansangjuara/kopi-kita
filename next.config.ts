import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

// Nonce-free CSP, based on the Next.js docs "Without Nonces" example
// (node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md),
// narrowed down to the external origins Kopi Kita really uses:
//   - PostHog: us-assets.i.posthog.com (SDK assets), *.posthog.com (events, flags, replay)
//   - Vercel Analytics + Speed Insights: va.vercel-scripts.com, vitals.vercel-insights.com
//   - Sentry: events leave through the same-origin tunnel /monitoring; the ingest
//     origins stay allowed in case the tunnel is bypassed
//   - Unsplash: only used through next/image, listed for safety
// 'unsafe-eval' is required in development only (React debugging); production
// does not need it.
const isDev = process.env.NODE_ENV === "development";

const cspHeader = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://*.posthog.com https://us-assets.i.posthog.com https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://images.unsplash.com https://*.posthog.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.posthog.com https://us.i.posthog.com https://vitals.vercel-insights.com https://va.vercel-scripts.com https://*.ingest.us.sentry.io https://*.sentry.io",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  // Turbopack cannot resolve Tailwind CSS when the parent directory path
  // contains "###" characters (Turbopack bug: interprets them as null bytes).
  // Using Webpack bundler for build & dev keeps the project portable.
  turbopack: undefined,
  // Do not advertise the framework version to visitors.
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          // Cross-origin isolation, as far as it is safe here: COOP keeps other
          // origins out of our browsing context, CORP stops other sites from
          // embedding our resources. COEP require-corp is deliberately left out:
          // the PostHog assets loaded from us-assets.i.posthog.com do not send
          // CORP headers, so require-corp would break analytics.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  tunnelRoute: "/monitoring",
  silent: !process.env.CI,
});
