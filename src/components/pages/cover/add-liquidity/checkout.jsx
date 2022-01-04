import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { CoverFormAddLiquidity } from "@/components/UI/organisms/cover-form/add-liquidity";
import { CoverAddLiquidityDetailsPage as DetailsPage } from "@/components/UI/organisms/cover/add-liquidity/details"

export const CoverAddLiquidityCheckoutPage = () => {
  const { coverInfo } = useCoverInfo();

  if (!coverInfo) {
    return <>loading...</>;
  }

  return (
    <div>
      <DetailsPage>
        <div className="mt-12">
          <CoverFormAddLiquidity />
        </div>
      </DetailsPage>
    </div>
  );
};
