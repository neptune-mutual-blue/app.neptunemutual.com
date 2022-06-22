import BasketLiquidityPage from "@/modules/my-liquidity/basket-liquidity-page";
import { ComingSoon } from "@/common/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";

export function getStaticProps() {
  return {
    props: {
      disabled: !isFeatureEnabled("liquidity"),
    },
  };
}

export default function MyLiquidity({ disabled }) {
  if (disabled) {
    return <ComingSoon />;
  }

  return <BasketLiquidityPage />;
}
