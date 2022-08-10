import Head from "next/head";

import { PoolsTabs } from "@/src/modules/pools/PoolsTabs";
import { StakingPage } from "@/src/modules/pools/staking";
import { isFeatureEnabled } from "@/src/config/environment";
import { ComingSoon } from "@/common/ComingSoon";
import { SortableStatsProvider } from "@/src/context/SortableStatsContext";

export function getStaticProps() {
  return {
    props: {
      disabled: !isFeatureEnabled("staking-pool"),
    },
  };
}

export default function Staking({ disabled }) {
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
      <PoolsTabs active="staking">
        <SortableStatsProvider>
          <StakingPage />
        </SortableStatsProvider>
      </PoolsTabs>
    </main>
  );
}
