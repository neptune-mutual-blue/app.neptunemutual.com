import crypto from "crypto";

export const connectSources =
  [
    process.env.NEXT_PUBLIC_MUMBAI_SUBGRAPH_URL,
    process.env.NEXT_PUBLIC_FUJI_SUBGRAPH_URL,
    process.env.NEXT_PUBLIC_API_URL,
    "https://api.thegraph.com/ipfs/",
    "https://ipfs.infura.io:5001/",
  ]
    .map((x) => (x || "").trim())
    .filter((x) => !!x)
    .join(" ") || "";

const devScriptSrc =
  process.env.NODE_ENV === "development" ? `'unsafe-eval' 'unsafe-inline'` : "";

const upgradeInsecureRequests =
  process.env.NODE_ENV === "development" ? "" : "upgrade-insecure-requests";

const devConnectSrc =
  process.env.NODE_ENV === "development"
    ? ` http://localhost:3000 ws://localhost:3000`
    : "";

export const csp = [
  `script-src 'self' https://tagmanager.google.com https://*.googletagmanager.com ${devScriptSrc}`,
  `connect-src 'self' https://*.neptunemutual.com/ https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com ${connectSources} ${devConnectSrc}`,
  "style-src 'self' 'unsafe-inline' https://tagmanager.google.com https://fonts.googleapis.com",
  `${upgradeInsecureRequests}`,
  "frame-ancestors 'none'",
  "default-src 'none'",
  "prefetch-src 'self'",
  "manifest-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
  "object-src 'none'",
  "img-src 'self' www.googletagmanager.com https://ssl.gstatic.com https://www.gstatic.com https://*.google-analytics.com https://*.googletagmanager.com data:",
  "font-src 'self' https://fonts.gstatic.com data:",
];

export const generateNonce = () => {
  const nonceGenerated = crypto.randomBytes(16).toString("base64");

  return nonceGenerated;
};

export const setCspHeaderWithNonce = (res, nonce) => {
  const headerKey = "Content-Security-Policy";

  const cspString = csp
    .join("; ")
    .replace(`script-src`, `script-src 'nonce-${nonce}'`);

  res.setHeader(headerKey, cspString);
};
