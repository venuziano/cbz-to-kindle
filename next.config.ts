import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirect Vercel default domain to the production domain
      {
        source: "/:path*",
        has: [{ type: "host", value: "cbz-to-kindle.vercel.app" }],
        destination: "https://www.cbz-to-pdf.com.br/:path*",
        permanent: true,
      },
      // Redirect non-www to www
      {
        source: "/:path*",
        has: [{ type: "host", value: "cbz-to-pdf.com.br" }],
        destination: "https://www.cbz-to-pdf.com.br/:path*",
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "my-company-lni",
  project: "cbz-to-pdf",

  // Only print logs for uploading source maps in CI
  silent: true,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,
  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/api/monitoring", // Use your SSR route here,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,


  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },
}));