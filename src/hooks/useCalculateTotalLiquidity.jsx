import { useCalculatePods } from "@/src/hooks/provide-liquidity/useCalculatePods";
import { useMyLiquidities } from "@/src/hooks/useMyLiquidities";
import { useState } from "react";

export const useCalculateTotalLiquidity = () => {
  const [data, setData] = useState({});

  let totaltestResult = 0;

  const {
    data: { myLiquidities },
    loading,
  } = useMyLiquidities();

  console.log(myLiquidities);

  const { receiveAmount } = useCalculatePods({
    coverKey: myLiquidities[0]?.cover?.coverKey,
    value: myLiquidities[0]?.totalPodsRemaining,
    podAddress: myLiquidities[0]?.cover.vaults[0].address,
  });

  console.log(receiveAmount);

  return totaltestResult;
};
