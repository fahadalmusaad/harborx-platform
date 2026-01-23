import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// PWA configuration - using require as next-pwa doesn't have ESM support yet
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // Empty turbopack config to acknowledge Turbopack usage
  turbopack: {},
};

export default withNextIntl(withPWA(nextConfig));
