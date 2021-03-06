import { useState, useEffect, useCallback } from "react";
import { getGraphURL } from "@/src/config/environment";
import { useNetwork } from "@/src/context/Network";
import { CARDS_PER_PAGE } from "@/src/config/constants";

export const usePodStakingPools = () => {
  const [data, setData] = useState({ pools: [] });
  const [loading, setLoading] = useState(false);
  const { networkId } = useNetwork();
  const [itemsToSkip, setItemsToSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let ignore = false;

    if (!networkId) {
      setHasMore(false);
      return;
    }

    const graphURL = getGraphURL(networkId);

    if (!graphURL) {
      return;
    }

    setLoading(true);
    fetch(graphURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: `
        {
          pools(
            skip: ${itemsToSkip}
            first: ${CARDS_PER_PAGE}
            where: {
              closed: false, 
              poolType: PODStaking
            }
          ) {
            id
            key
            name
            poolType
            stakingToken
            stakingTokenName
            stakingTokenSymbol
            stakingTokenDecimals
            uniStakingTokenDollarPair
            rewardToken
            rewardTokenName
            rewardTokenSymbol
            rewardTokenDecimals
            uniRewardTokenDollarPair
            rewardTokenDeposit
            maxStake
            rewardPerBlock
            lockupPeriodInBlocks
            platformFee
          }
        }
        `,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (ignore) return;

        if (res.errors || !res.data) {
          return;
        }

        const isLastPage =
          res.data.pools.length === 0 || res.data.pools.length < CARDS_PER_PAGE;

        if (isLastPage) {
          setHasMore(false);
        }

        setData((prev) => ({
          pools: [...prev.pools, ...res.data.pools],
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
