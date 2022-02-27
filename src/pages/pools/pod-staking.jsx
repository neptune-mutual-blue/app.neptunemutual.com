import Head from "next/head";

import { PoolsTabs } from "@/components/pages/pools/PoolsTabs";
import { PodStakingPage } from "@/components/pages/pools/pod-staking";

export default function PodStaking() {
  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>
      <PoolsTabs active="pod-staking">
        <PodStakingPage />
      </PoolsTabs>
    </main>
  );
}
