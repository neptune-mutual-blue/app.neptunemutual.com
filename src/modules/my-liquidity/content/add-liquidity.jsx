import { CoverAddLiquidityDetailsPage } from "@/src/modules/cover/add-liquidity/basket-add-liquidity";
import { LiquidityFormsProvider } from "@/common/LiquidityForms/LiquidityFormsContext";
import { CoverStatsProvider } from "@/common/Cover/CoverStatsContext";
import { useRouter } from "next/router";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";

export default function AddLiquidity() {
  const router = useRouter();
  const { cover_id = "animated-brands", product_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);
  const productKey = safeFormatBytes32String(product_id);

  return (
    <CoverStatsProvider coverKey={coverKey} productKey={productKey}>
      <LiquidityFormsProvider coverKey={coverKey}>
        <CoverAddLiquidityDetailsPage />
      </LiquidityFormsProvider>
    </CoverStatsProvider>
  );
}
