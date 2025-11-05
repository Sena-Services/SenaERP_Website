import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
      },
      {
        protocol: 'http',
        hostname: 'senatest2.localhost',
        port: '8000',
      },
      {
        protocol: 'https',
        hostname: 'senamarketing.senaerp.com',
      },
    ],
  },
  // WSL2 optimizations to prevent file watching issues
  experimental: {
    webpackBuildWorker: true,
  },
  // Reduce memory pressure
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
