import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { CoverFormAddLiquidity } from "@/components/UI/organisms/cover-form/add-liquidity";
import { CoverAddLiquidityDetailsPage as DetailsPage } from "@/components/UI/organisms/cover/add-liquidity/details";
import { useRouter } from "next/router";

export const CoverAddLiquidityCheckoutPage = () => {
  const router = useRouter();
  const { cover_id } = router.query;
  const { coverInfo } = useCoverInfo();

  if (!coverInfo) {
    return <>loading...</>;
  }

  const reassuranceToken = coverInfo.reassuranceToken;

  return (
    <div>
      <DetailsPage>
        <div className="mt-12">
          <CoverFormAddLiquidity
            coverKey={cover_id}
            assuranceTokenAddress={reassuranceToken.at}
            assuranceTokenSymbol={reassuranceToken.symbol}
          />
        </div>
      </DetailsPage>
    </div>
  );
};
