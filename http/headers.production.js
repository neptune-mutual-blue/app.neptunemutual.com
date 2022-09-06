const crypto = require("crypto");
const { gtmScript } = require("../src/config/scripts/google");

/** @param {string} data */
const generateShaHash = (data) => {
  return crypto.createHash("sha256").update(data, "binary").digest("base64");
};

const inlineScripts = [gtmScript];

const scriptHashes = inlineScripts.map(
  (content) => `'sha256-${generateShaHash(content)}'`
);

const scriptSources = ["https://*.googletagmanager.com"]
  .map((x) => (x || "").trim())
  .filter((x) => !!x);

const connectSources = [
  process.env.NEXT_PUBLIC_MUMBAI_SUBGRAPH_URL,
  process.env.NEXT_PUBLIC_FUJI_SUBGRAPH_URL,
  process.env.NEXT_PUBLIC_API_URL,
  "https://api.thegraph.com/ipfs/",
  "https://ipfs.infura.io:5001/",
  "https://*.googletagmanager.com",
  "https://*.neptunemutual.com/",
]
  .map((x) => (x || "").trim())
  .filter((x) => !!x);

const production = [
  {
    key: "Content-Security-Policy",
    values: [
      `script-src 'self' ${scriptSources.join()} ${scriptHashes.join(" ")}`,
      `connect-src 'self' ${connectSources.join(" ")}`,
      "style-src 'self' 'unsafe-inline'",
      "upgrade-insecure-requests",
      "frame-ancestors 'none'",
      "default-src 'none'",
      "prefetch-src 'self'",
      "manifest-src 'self'",
      "base-uri 'none'",
      "form-action 'none'",
      "object-src 'none'",
      "img-src 'self' data:",
      "font-src 'self'",
      "frame-src 'none'",
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

module.exports = production;
