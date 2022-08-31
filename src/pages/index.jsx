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

export const getServerSideProps = async ({ req, res }) => {
  const nonce = crypto.randomBytes(16).toString("base64");
  res.setHeader("Content-Security-Policy", [
    `script-src 'self' 'nonce-${nonce}' https://tagmanager.google.com https://*.googletagmanager.com`,
  ]);

  return {
    props: {
      nonce,
    },
  };
};
