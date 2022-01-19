import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { ProvideLiquidityForm } from "@/components/UI/organisms/cover-form/ProvideLiquidityForm";
import { CoverAddLiquidityDetailsPage as DetailsPage } from "@/components/UI/organisms/cover/add-liquidity/details";
import { useRouter } from "next/router";

export const CoverAddLiquidityCheckoutPage = () => {
  const router = useRouter();
  const { cover_id } = router.query;
  const { coverInfo } = useCoverInfo(cover_id);

  if (!coverInfo) {
    return <>loading...</>;
  }

  return (
    <div>
      <DetailsPage>
        <div className="mt-12">
          <ProvideLiquidityForm coverKey={cover_id} />
        </div>
      </DetailsPage>
    </div>
  );
};
