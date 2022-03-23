module.exports = [
  {
    key: "Content-Security-Policy",
    values: [
      "script-src 'self'",
      `connect-src 'self' https://eth-mainnet.alchemyapi.io https://eth-ropsten.alchemyapi.io https://eth-kovan.alchemyapi.io https://*.neptunemutual.com/ https://rpc-mumbai.maticvigil.com/ https://ipfs.infura.io:5001/ https://kovan.infura.io/ https://ropsten.infura.io/ https://*.binance.org:8545/ https://api.thegraph.com/ ${
        process.env.NEXT_PUBLIC_API_URL || ""
      }`,
      "style-src 'self' 'unsafe-inline'",
      "upgrade-insecure-requests",
      "frame-ancestors 'none'",
      "default-src 'self'",
      "prefetch-src 'self'",
      "manifest-src 'self'",
      "base-uri 'none'",
      "form-action 'none'",
      "object-src 'none'",
      "img-src 'self' data:",
      "font-src 'self'",
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
