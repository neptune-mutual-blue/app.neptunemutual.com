import Head from "next/head";
import { PoolsTabs } from "@/src/modules/pools/PoolsTabs";
import BondPage from "@/src/modules/pools/bond";
import { ComingSoon } from "@/common/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";

/* istanbul ignore next */
export function getStaticProps() {
  return {
    props: {
      disabled: !isFeatureEnabled("bond"),
    },
  };
}

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
