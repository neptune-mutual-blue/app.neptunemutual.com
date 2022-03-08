import Head from "next/head";

import { PoolsTabs } from "@/components/pages/pools/PoolsTabs";
import { StakingPage } from "@/components/pages/pools/staking";
import { getFeatures } from "@/src/config/environment";
import PageNotFound from "@/src/pages/404";

// This gets called on every request
export async function getServerSideProps() {
  // Pass data to the page via props
  const features = getFeatures();
  const enabled = features.indexOf("staking-pool") > -1;

  return {
    props: {
      disabled: !enabled,
    },
  };
}

export default function Staking({ disabled }) {
  if (disabled) {
    return <PageNotFound />;
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
      <PoolsTabs active="staking">
        <StakingPage />
      </PoolsTabs>
    </main>
  );
}
