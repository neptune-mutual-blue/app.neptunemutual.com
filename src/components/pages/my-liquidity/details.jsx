import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { MyLiquidityForm } from "@/components/UI/organisms/cover-form/my-liquidity/MyLiquidityForm";
import { MyLiquidityDetailsPage } from "@/components/UI/organisms/cover/my-liquidity/details";
import { useRouter } from "next/router";

export const MyLiquidityCheckoutPage = () => {
  const router = useRouter();
  const { cover_id } = router.query;
  const { coverInfo } = useCoverInfo(cover_id);

  if (!coverInfo) {
    return <>loading...</>;
  }

  const reassuranceToken = coverInfo.reassuranceToken;

  return (
    <div>
      <MyLiquidityDetailsPage>
        <div className="mt-12">
          <MyLiquidityForm
            coverKey={cover_id}
            assuranceTokenAddress={reassuranceToken.at}
            assuranceTokenSymbol={reassuranceToken.symbol}
          />
        </div>
      </MyLiquidityDetailsPage>
    </div>
  );
};
