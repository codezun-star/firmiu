const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sandbox-cdn.paddle.com https://cdn.paddle.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://sandbox-cdn.paddle.com https://cdn.paddle.com",
      "font-src 'self' https://fonts.gstatic.com https://sandbox-cdn.paddle.com data:",
      "frame-src 'self' https://sandbox-buy.paddle.com https://buy.paddle.com https://*.supabase.co blob:",
      "frame-ancestors 'self' http://localhost:3000 https://firmiu.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.paddle.com https://sandbox-cdn.paddle.com https://sandbox-checkout-service.paddle.com https://ip-api.com",
      "img-src 'self' data: blob: https://*.paddle.com https://sandbox-cdn.paddle.com https://*.supabase.co https://images.unsplash.com",
      "media-src 'self'",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
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
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
