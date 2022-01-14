import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { CoverFormMyLiquidity } from "@/components/UI/organisms/cover-form/my-liquidity";
import { MyLiquidityDetailsPage as DetailsPage } from "@/components/UI/organisms/cover/my-liquidity/details";
import { useRouter } from "next/router";

export const MyLiquidityCheckoutPage = () => {
  const router = useRouter();
  const { coverInfo } = useCoverInfo();
  const { cover_id } = router.query;

  if (!coverInfo) {
    return <>loading...</>;
  }

  const reassuranceToken = coverInfo.reassuranceToken;

  return (
    <div>
      <DetailsPage>
        <div className="mt-12">
          <CoverFormMyLiquidity
            coverKey={cover_id}
            assuranceTokenAddress={reassuranceToken.at}
            assuranceTokenSymbol={reassuranceToken.symbol}
          />
        </div>
      </DetailsPage>
    </div>
  );
};
