import { useEffect, useState } from "react";

import { useNetwork } from "@/src/context/Network";
import { useQuery } from "@/src/hooks/useQuery";
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

export const usePoolsTVL = (NPMTokenAddress) => {
  const [poolsTVL, setPoolsTVL] = useState({
    items: [],
    tvl: "0",
  });

  const { networkId } = useNetwork();
  const { data: graphData, refetch } = useQuery();

  useEffect(() => {
    let ignore = false;

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

      if (ignore) return;
      setPoolsTVL({
        items: result.items,
        tvl: result.total,
      });
    }

    updateTVL();

    return () => {
      ignore = true;
    };
  }, [NPMTokenAddress, graphData, networkId]);

  useEffect(() => {
    refetch(getQuery());
  }, [refetch]);

  const getTVLById = (id) => {
    const poolTVLInfo = poolsTVL.items.find((x) => x.id === id) || {};
    const tokensInfo = poolTVLInfo.data || [];

    const tvl = sumOf(...tokensInfo.map((x) => x.price || "0")).toString();
    return tvl;
  };

  return { tvl: poolsTVL.tvl, getTVLById };
};
