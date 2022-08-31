import Head from "next/head";
import { PoolsTabs } from "@/src/modules/pools/PoolsTabs";
import BondPage from "@/src/modules/pools/bond";
import { ComingSoon } from "@/common/ComingSoon";
import crypto from "crypto";

export default function Bond({ disabled }) {
  if (disabled) {
    return <ComingSoon />;
  }

  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>
      <PoolsTabs active="bond">
        <BondPage />
      </PoolsTabs>
    </main>
  );
}

export const getServerSideProps = async ({ req: _, res }) => {
  const nonceGenerated = crypto.randomBytes(16).toString("base64");
  const headerKey = "Content-Security-Policy";

  const cspWithNonce = res
    .getHeader(headerKey)
    .replace(
      `script-src 'self'`,
      `script-src 'nonce-${nonceGenerated}' 'strict-dynamic'`
    );

  res.setHeader(headerKey, cspWithNonce);

  return {
    props: {
      nonce: nonceGenerated,
    },
  };
};
