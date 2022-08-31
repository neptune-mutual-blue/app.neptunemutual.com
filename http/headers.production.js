const connectSources = [
  process.env.NEXT_PUBLIC_MUMBAI_SUBGRAPH_URL,
  process.env.NEXT_PUBLIC_FUJI_SUBGRAPH_URL,
  process.env.NEXT_PUBLIC_API_URL,
  "https://api.thegraph.com/ipfs/",
  "https://ipfs.infura.io:5001/",
]
  .map((x) => (x || "").trim())
  .filter((x) => !!x)
  .join(" ");

module.exports = [
  {
    key: "Content-Security-Policy",
    values: [
      `script-src 'self' 'nonce-random' https://tagmanager.google.com https://*.googletagmanager.com`,
      `connect-src 'self' https://*.neptunemutual.com/ https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com ${
        connectSources || ""
      }`,
      "style-src 'self' 'unsafe-inline' https://tagmanager.google.com https://fonts.googleapis.com",
      "upgrade-insecure-requests",
      "frame-ancestors 'none'",
      "default-src 'none'",
      "prefetch-src 'self'",
      "manifest-src 'self'",
      "base-uri 'none'",
      "form-action 'none'",
      "object-src 'none'",
      "img-src 'self' www.googletagmanager.com https://ssl.gstatic.com https://www.gstatic.com https://*.google-analytics.com https://*.googletagmanager.com data:",
      "font-src 'self' https://fonts.gstatic.com data:",
    ],
  },
  {
    key: "X-DNS-Prefetch-Control",
    values: ["on"],
  },
  {
    key: "X-XSS-Protection",
    values: ["1", "mode=block"],
  },
  {
    key: "X-Frame-Options",
    values: ["DENY"],
  },
  {
    key: "Referrer-Policy",
    values: ["strict-origin"],
  },
  {
    key: "X-Content-Type-Options",
    values: ["nosniff"],
  },
  {
    key: "Strict-Transport-Security",
    values: ["max-age=31536000", "includeSubDomains"],
  },
  {
    key: "Expect-CT",
    values: ["enforce, max-age=31536000"],
  },
  {
    key: "Feature-Policy",
    values: [
      "microphone 'none'",
      "camera 'none'",
      "fullscreen 'none'",
      "geolocation 'none'",
    ],
  },
  {
    key: "Permissions-Policy",
    values: ["fullscreen=(), geolocation=()"],
  },
  {
    key: "X-Permitted-Cross-Domain-Policies",
    values: ["none"],
  },
  {
    key: "Access-Control-Allow-Credentials",
    values: ["false"],
  },
  {
    key: "Access-Control-Allow-Headers",
    values: ["*"],
  },
  {
    key: "Access-Control-Allow-Methods",
    values: ["GET"],
  },
  {
    key: "Access-Control-Allow-Origin",
    values: ["null"],
  },
  {
    key: "Access-Control-Max-Age",
    values: ["600"],
  },
];
