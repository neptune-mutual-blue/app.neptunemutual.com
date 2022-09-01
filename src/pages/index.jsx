import Head from "next/head";

import HomePage from "@/modules/home";
import crypto from "crypto";

export default function Home() {
  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>
      <HomePage />
    </main>
  );
}

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

const csp = [
  `script-src 'self' https://tagmanager.google.com https://*.googletagmanager.com ${
    process.env.NODE_ENV === "development"
      ? `'unsafe-eval' 'unsafe-inline'`
      : ""
  }`,
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
];

export const getServerSideProps = async ({ req: _, res }) => {
  const nonceGenerated = crypto.randomBytes(16).toString("base64");
  const headerKey = "Content-Security-Policy";

  const cspString = csp
    .join("; ")
    .replace(`script-src`, `script-src 'nonce-${nonceGenerated}'`);

  res.setHeader(headerKey, cspString);

  return {
    props: {
      nonce: nonceGenerated,
    },
  };
};
