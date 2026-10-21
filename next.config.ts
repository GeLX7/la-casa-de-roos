import type { NextConfig } from "next";

/* Allow next/image to optimize owner-uploaded photos served from Supabase
   Storage (first-party storage — NOT third-party hotlinking). The host is
   derived from NEXT_PUBLIC_SUPABASE_URL so nothing is hardcoded; we still never
   allow Airbnb/muscache assets (docs/research/content-rights-checklist.md). */
const supabaseHost = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return undefined;
  try {
    return new URL(url).hostname;
  } catch {
    return undefined;
  }
})();

/* Security headers (point 9). CSP keeps 'unsafe-inline' for scripts/styles
   because Next.js injects inline hydration scripts and the page has JSON-LD;
   nonces would force every page to render dynamically (losing the cache).
   Everything else is locked to this origin (+ Supabase Storage for photos). */
const supabaseOrigin = supabaseHost ? `https://${supabaseHost}` : "";
const isDev = process.env.NODE_ENV !== "production";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${supabaseOrigin}`.trim(),
  "font-src 'self' data:",
  `connect-src 'self' ${supabaseOrigin}`.trim(),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/room-images/**",
          },
        ]
      : [],
  },
  async redirects() {
    // Old room slugs -> new "roos-..." slugs (permanent, keeps old links and SEO).
    const moved: Record<string, string> = {
      "suite-queen-con-sala": "roos-corazon",
      "suite-queen-centro-historico": "roos-centro",
      "suite-queen-con-vista": "roos-vista",
      "mini-apartamento-familiar": "roos-familiar",
      "mini-apartamento-centro": "roos-mini-centro",
    };
    return Object.entries(moved).map(([from, to]) => ({
      source: `/habitaciones/${from}`,
      destination: `/habitaciones/${to}`,
      permanent: true,
    }));
  },
  experimental: {
    // Admin photo uploads run through the (auth-gated) upload server action.
    // The 1 MB default would reject real photos; 30 MB covers a small batch.
    // Per-file 10 MB is enforced in the action + on the storage bucket.
    serverActions: {
      bodySizeLimit: "30mb",
    },
  },
};

export default nextConfig;
