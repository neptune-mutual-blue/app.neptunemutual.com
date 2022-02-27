import Head from "next/head";

import { PoolsTabs } from "@/components/pages/pools/PoolsTabs";
import { StakingPage } from "@/components/pages/pools/staking";

export default function Staking() {
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
