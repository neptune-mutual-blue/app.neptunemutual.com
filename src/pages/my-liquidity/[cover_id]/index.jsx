import Head from "next/head";
import { MyLiquidityCoverPage } from "@/src/modules/my-liquidity/details";
import { ComingSoon } from "@/common/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";
import { LiquidityFormsProvider } from "@/common/LiquidityForms/LiquidityFormsContext";
import { useRouter } from "next/router";
import { CoverStatsProvider } from "@/common/Cover/CoverStatsContext";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { generateNonce, setCspHeaderWithNonce } from "@/utils/cspHeader";

export default function MyLiquidityCover({ disabled }) {
  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);
  const productKey = safeFormatBytes32String("");

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

      <CoverStatsProvider coverKey={coverKey} productKey={productKey}>
        <LiquidityFormsProvider coverKey={coverKey}>
          <MyLiquidityCoverPage />
        </LiquidityFormsProvider>
      </CoverStatsProvider>
    </main>
  );
}

export const getServerSideProps = async ({ req: _, res }) => {
  const nonce = generateNonce();

  setCspHeaderWithNonce(res, nonce);

  return {
    props: {
      nonce,
      disabled: !isFeatureEnabled("liquidity"),
    },
  };
};
