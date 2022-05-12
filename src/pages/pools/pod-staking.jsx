import Head from "next/head";

import { PoolsTabs } from "@/src/modules/pools/PoolsTabs";
import { PodStakingPage } from "@/src/modules/pools/pod-staking";
import { ComingSoon } from "@/common/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";
import { SortableStatsProvider } from "@/src/context/SortableStatsContext";

export function getStaticProps() {
  return {
    props: {
      disabled: !isFeatureEnabled("pod-staking-pool"),
    },
  };
}

export default function PodStaking({ disabled }) {
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
      <PoolsTabs active="pod-staking">
        <SortableStatsProvider>
          <PodStakingPage />
        </SortableStatsProvider>
      </PoolsTabs>
    </main>
  );
}
