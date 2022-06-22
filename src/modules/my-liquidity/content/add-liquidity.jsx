import { CoverAddLiquidityDetailsPage } from "@/src/modules/cover/add-liquidity";
import { LiquidityFormsProvider } from "@/common/LiquidityForms/LiquidityFormsContext";
import { CoverStatsProvider } from "@/common/Cover/CoverStatsContext";
import { useRouter } from "next/router";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";

export default function AddLiquidity() {
  const router = useRouter();
  const { cover_id = "animated-brands" } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);

  return (
    <CoverStatsProvider coverKey={coverKey}>
      <LiquidityFormsProvider coverKey={coverKey}>
        <CoverAddLiquidityDetailsPage />
      </LiquidityFormsProvider>
    </CoverStatsProvider>
  );
}
