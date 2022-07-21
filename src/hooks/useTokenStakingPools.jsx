import { useState, useEffect, useCallback } from "react";
import { useNetwork } from "@/src/context/Network";
import { CARDS_PER_PAGE } from "@/src/config/constants";
import { getSubgraphData } from "@/src/services/subgraph";

export const useTokenStakingPools = () => {
  const [data, setData] = useState({
    pools: [],
  });
  const [loading, setLoading] = useState(false);
  const [itemsToSkip, setItemsToSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { networkId } = useNetwork();

  useEffect(() => {
    let ignore = false;

    if (!networkId) {
      setHasMore(false);
    }
    const query = `
    {
      pools(
        skip: ${itemsToSkip}
        first: ${CARDS_PER_PAGE}
        where: {
          closed: false, 
          poolType: TokenStaking
        }
      ) {
        id
        key
        name
        poolType
        stakingToken
        stakingTokenName
        stakingTokenSymbol
        uniStakingTokenDollarPair
        rewardToken
        rewardTokenName
        rewardTokenSymbol
        uniRewardTokenDollarPair
        rewardTokenDeposit
        maxStake
        rewardPerBlock
        lockupPeriodInBlocks
        platformFee
      }
    }
    `;

    setLoading(true);
    getSubgraphData(networkId, query)
      .then((_data) => {
        if (ignore) return;

        if (!_data) return;

        const isLastPage =
          _data.pools.length === 0 || _data.pools.length < CARDS_PER_PAGE;

        if (isLastPage) {
          setHasMore(false);
        }

        setData((prev) => ({
          pools: [...prev.pools, ..._data.pools],
        }));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (ignore) return;
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [itemsToSkip, networkId]);

  const handleShowMore = useCallback(() => {
    setItemsToSkip((prev) => prev + CARDS_PER_PAGE);
  }, []);

  return {
    handleShowMore,
    hasMore,
    data: {
      pools: data.pools,
    },
    loading,
  };
};
