import Head from "next/head";

import { CoverAddLiquidityDetailsPage } from "@/components/pages/cover/add-liquidity";
import { ComingSoon } from "@/components/pages/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";

export function getServerSideProps() {
  return {
    props: {
      disabled: !isFeatureEnabled("liquidity"),
    },
  };
}

export default function CoverAddLiquidityDetails({ disabled }) {
  if (disabled) {
    return <ComingSoon />;
  }

  return (
    <>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>
      <CoverAddLiquidityDetailsPage />
    </>
  );
}
