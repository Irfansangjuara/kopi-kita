import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack cannot resolve Tailwind CSS when the parent directory path
  // contains "###" characters (Turbopack bug: interprets them as null bytes).
  // Using Webpack bundler for build & dev keeps the project portable.
  turbopack: undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  tunnelRoute: "/monitoring",
  silent: !process.env.CI,
});
