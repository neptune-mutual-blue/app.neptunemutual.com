import { useCallback, useEffect, useState } from "react";

import { calcBondPoolTVL } from "@/src/helpers/bond";
import { calcStakingPoolTVL } from "@/src/helpers/pool";
import { getPricingData } from "@/src/helpers/pricing";
import { isEqualTo, sumOf, toBN } from "@/utils/bn";
import { getNpmPayload } from "@/src/helpers/token";
import { fetchSubgraph } from "@/src/services/fetchSubgraph";
import { getNetworkId } from "@/src/config/environment";

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

/**
 *
 * @param {string} NPMTokenAddress
 * @returns
 */
export const usePoolsTVL = (NPMTokenAddress) => {
  const [poolsTVL, setPoolsTVL] = useState({
    items: [],
    tvl: "0",
  });

  useEffect(() => {
    if (NPMTokenAddress) {
      const networkId = getNetworkId();

      fetchSubgraph("usePoolsTVL")(networkId, getQuery())
        .then(async ({ bondPools, pools }) => {
          const bondsPayload = bondPools.map((bondPool) => {
            return calcBondPoolTVL(bondPool, networkId, NPMTokenAddress);
          });

          const poolsPayload = pools.map((currentPool) => {
            return calcStakingPoolTVL(currentPool);
          });

          const npmPayload = getNpmPayload(NPMTokenAddress);

          const result = await getPricingData(networkId, [
            ...bondsPayload,
            ...poolsPayload,
            ...npmPayload,
          ]);

          setPoolsTVL({
            items: result.items,
            tvl: result.total,
          });
        })
        .catch((e) => console.error(`Error: ${e.message}`));
    }
  }, [NPMTokenAddress]);

  const getTVLById = useCallback(
    /**
     * @param {string} id
     * @returns {string}
     */
    (id) => {
      const poolTVLInfo = poolsTVL.items.find((x) => x.id === id) || {};
      const tokensInfo = poolTVLInfo.data || [];

      const tvl = sumOf(...tokensInfo.map((x) => x.price || "0")).toString();
      return tvl;
    },
    [poolsTVL.items]
  );

  const getPriceByAddress = useCallback(
    /**
     * @param {string} address
     * @returns {string}
     */
    (address) => {
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
    },
    [poolsTVL.items]
  );

  return { tvl: poolsTVL.tvl, getTVLById, getPriceByAddress };
};
