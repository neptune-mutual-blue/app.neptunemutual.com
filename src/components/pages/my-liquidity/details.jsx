import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { MyLiquidityDetailsPage } from "@/components/UI/organisms/cover/my-liquidity/details";
import { toBytes32 } from "@/src/helpers/cover";
import { useRouter } from "next/router";

export const MyLiquidityCheckoutPage = () => {
  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = toBytes32(cover_id);
  const { coverInfo } = useCoverInfo(coverKey);

  if (!coverInfo) {
    return <>loading...</>;
  }

  return (
    <div>
      <MyLiquidityDetailsPage></MyLiquidityDetailsPage>
    </div>
  );
};
