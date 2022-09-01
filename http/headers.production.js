module.exports = [
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
