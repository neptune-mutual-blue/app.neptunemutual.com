import { useState, useEffect, useCallback } from "react";
import { getGraphURL } from "@/src/config/environment";
import { useNetwork } from "@/src/context/Network";
import { CARDS_PER_PAGE } from "@/src/config/constants";
import { useWeb3React } from "@web3-react/core";

export const useTokenStakingPools = () => {
  const [data, setData] = useState({
    pools: [],
  });
  const [loading, setLoading] = useState(false);
  const [itemsToSkip, setItemsToSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { networkId } = useNetwork();
  const { account } = useWeb3React();

  useEffect(() => {
    setItemsToSkip(0);
    setData({
      pools: [],
    });
  }, [account]);

  useEffect(() => {
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
        `,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
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
        setLoading(false);
      });
  }, [account, itemsToSkip, networkId]); // TODO: remove `account` and fix issue with first useEffect which clears current data when account changes but does not fetch the new data

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
