import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No images.remotePatterns on purpose: production must never hotlink
  // Airbnb/muscache assets (docs/research/content-rights-checklist.md).
  // Owner-provided originals will live in /public or first-party storage.
};

export default nextConfig;
