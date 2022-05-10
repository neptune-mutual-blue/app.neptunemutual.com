import Head from "next/head";
import { MyLiquidityCoverPage } from "@/src/modules/my-liquidity/details";
import { ComingSoon } from "@/common/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";
import { LiquidityFormsProvider } from "@/common/LiquidityForms/LiquidityFormsContext";
import { useRouter } from "next/router";
import { safeFormatBytes32String } from "@/src/helpers/cover";
import { CoverInfoProvider } from "@/common/Cover/CoverInfoContext";

export function getServerSideProps() {
  return {
    props: {
      disabled: !isFeatureEnabled("liquidity"),
    },
  };
}

export default function MyLiquidityCover({ disabled }) {
  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);

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

      <CoverInfoProvider coverKey={coverKey}>
        <LiquidityFormsProvider coverKey={coverKey}>
          <MyLiquidityCoverPage />
        </LiquidityFormsProvider>
      </CoverInfoProvider>
    </main>
  );
}
