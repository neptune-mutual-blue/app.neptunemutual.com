import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { CoverFormMyLiquidity } from "@/components/UI/organisms/cover-form/my-liquidity";
import { MyLiquidityDetailsPage as DetailsPage } from "@/components/UI/organisms/cover/my-liquidity/details";

export const MyLiquidityCheckoutPage = () => {
  const { coverInfo } = useCoverInfo();

  if (!coverInfo) {
    return <>loading...</>;
  }

  return (
    <div>
      <DetailsPage>
        <div className="mt-12">
          <CoverFormMyLiquidity />
        </div>
      </DetailsPage>
    </div>
  );
};
