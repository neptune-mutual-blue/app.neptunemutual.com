import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { MyLiquidityDetailsPage } from "@/components/UI/organisms/cover/my-liquidity/details";
import { useRouter } from "next/router";

export const MyLiquidityCheckoutPage = () => {
  const router = useRouter();
  const { cover_id } = router.query;
  const { coverInfo } = useCoverInfo(cover_id);

  if (!coverInfo) {
    return <>loading...</>;
  }

  return (
    <div>
      <MyLiquidityDetailsPage></MyLiquidityDetailsPage>
    </div>
  );
};
