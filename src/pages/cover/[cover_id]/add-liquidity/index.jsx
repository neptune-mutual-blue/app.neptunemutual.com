import Head from "next/head";

import { CoverAddLiquidityDetailsPage } from "@/components/pages/cover/add-liquidity";

export default function CoverAddLiquidityDetails() {
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
