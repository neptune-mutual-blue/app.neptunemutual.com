import Head from "next/head";

import { CoverAddLiquidityDetailsPage } from "@/src/modules/cover/add-liquidity";
import { ComingSoon } from "@/common/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";
import { LiquidityFormsProvider } from "@/common/LiquidityForms/LiquidityFormsContext";
import { toBytes32 } from "@/src/helpers/cover";
import { useRouter } from "next/router";
import { CoverInfoProvider } from "@/common/Cover/CoverInfoContext";

export function getServerSideProps() {
  return {
    props: {
      disabled: !isFeatureEnabled("liquidity"),
    },
  };
}

export default function CoverAddLiquidityDetails({ disabled }) {
  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = toBytes32(cover_id);

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

      <CoverInfoProvider coverKey={coverKey}>
        <LiquidityFormsProvider coverKey={coverKey}>
          <CoverAddLiquidityDetailsPage />
        </LiquidityFormsProvider>
      </CoverInfoProvider>
    </>
  );
}
