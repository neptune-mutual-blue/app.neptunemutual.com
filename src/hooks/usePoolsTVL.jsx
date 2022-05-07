import { useCallback, useEffect, useState } from "react";

import { useNetwork } from "@/src/context/Network";
import { useQuery } from "@/src/hooks/useQuery";
import { calcBondPoolTVL } from "@/src/helpers/bond";
import { calcStakingPoolTVL } from "@/src/helpers/pool";
import { getPricingData } from "@/src/helpers/pricing";
import { isEqualTo, sumOf, toBN } from "@/utils/bn";
import { getNpmPayload } from "@/src/helpers/token";

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
        return calcStakingPoolTVL(currentPool);
      });

      const npmPayload = getNpmPayload(NPMTokenAddress);

      const result = await getPricingData(networkId, [
        ...bondsPayload,
        ...poolsPayload,
        ...npmPayload,
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

  const getTVLById = useCallback(
    (id) => {
      const poolTVLInfo = poolsTVL.items.find((x) => x.id === id) || {};
      const tokensInfo = poolTVLInfo.data || [];

      const tvl = sumOf(...tokensInfo.map((x) => x.price || "0")).toString();
      return tvl;
    },
    [poolsTVL.items]
  );

  const getPriceByAddress = (address) => {
    for (let i = 0; i < poolsTVL.items.length; i++) {
      const item = poolsTVL.items[i];

      for (let j = 0; j < item.data.length; j++) {
        const tokenData = item.data[j];
        if (tokenData.address.toLowerCase() == address.toLowerCase()) {
          if (isEqualTo(tokenData.amount, "0")) {
            return "0";
          }

          return toBN(tokenData.price).dividedBy(tokenData.amount).toString();
        }
      }
    }

    return "0";
  };

  return { tvl: poolsTVL.tvl, getTVLById, getPriceByAddress };
};
