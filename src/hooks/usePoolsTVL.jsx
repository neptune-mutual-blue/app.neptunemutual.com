import { useEffect, useRef, useState } from "react";

import { useAppContext } from "@/src/context/AppWrapper";
import { useQuery } from "@/src/hooks/useQuery";
import { useAppConstants } from "@/src/context/AppConstants";
import { calcBondPoolTVL } from "@/src/helpers/bond";
import { calcStakingPoolTVL } from "@/src/helpers/pool";
import { getPricingData } from "@/src/helpers/pricing";
import { sumOf } from "@/utils/bn";

const getQuery = () => {
  return `
  {
    pools {
      id
      poolType
      rewardToken
      stakingToken
      rewardTokenDeposit
      totalRewardsWithdrawn
      totalStakingTokenDeposited
      totalStakingTokenWithdrawn
    }
    bondPools {
      id
      address0
      values
      totalBondClaimed
      totalLpAddedToBond
    }
  }`;
};

export const usePoolsTVL = () => {
  const [poolsTVL, setPoolsTVL] = useState({
    items: [],
    tvl: "0",
  });
  const mountedRef = useRef(false);

  const { networkId } = useAppContext();
  const { NPMTokenAddress } = useAppConstants();
  const { data: graphData, refetch } = useQuery();

  useEffect(() => {
    async function updateTVL() {
      if (!graphData || !NPMTokenAddress) return;

      const bondsPayload = graphData.bondPools.map((bondPool) => {
        return calcBondPoolTVL(bondPool, networkId, NPMTokenAddress);
      });

      const poolsPayload = graphData.pools.map((currentPool) => {
        return calcStakingPoolTVL(currentPool, networkId);
      });

      const result = await getPricingData(networkId, [
        ...bondsPayload,
        ...poolsPayload,
      ]);

      if (!mountedRef.current) return;
      setPoolsTVL({
        items: result.items,
        tvl: result.total,
      });
    }

    updateTVL();
  }, [NPMTokenAddress, graphData, networkId]);

  useEffect(() => {
    mountedRef.current = true;
    refetch(getQuery());

    return () => {
      mountedRef.current = false;
    };
  }, [refetch]);

  const getTVLById = (id) => {
    const poolTVLInfo = poolsTVL.items.find((x) => x.id === id) || {};
    const tokensInfo = poolTVLInfo.data || [];

    const tvl = sumOf(...tokensInfo.map((x) => x.price || "0")).toString();
    return tvl;
  };

  return { tvl: poolsTVL.tvl, getTVLById };
};
