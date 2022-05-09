import { useState, useEffect } from "react";
import { getGraphURL } from "@/src/config/environment";
import { useNetwork } from "@/src/context/Network";
import { COVERS_PER_PAGE } from "@/src/config/constants";
import { useWeb3React } from "@web3-react/core";
import { useAppConstants } from "@/src/context/AppConstants";

export const usePodStakingPools = () => {
  const [data, setData] = useState({
    pools: [],
  });
  const [loading, setLoading] = useState(false);
  const { networkId } = useNetwork();
  const [itemsToSkip, setItemsToSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { account } = useWeb3React();
  const { getTVLById, pooltsTvlItems } = useAppConstants();

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

    if (!graphURL || !account || !pooltsTvlItems.length) {
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
            first: ${COVERS_PER_PAGE}
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
            uniStakingTokenDollarPair
            rewardToken
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

        const isLastPage = res.data.pools.length < COVERS_PER_PAGE;

        if (isLastPage) {
          setHasMore(false);
        }

        setData((prev) => ({
          pools: [
            ...prev.pools,
            ...res.data.pools.map((pool) => {
              return {
                ...pool,
                tvl: getTVLById(pool.id),
              };
            }),
          ],
        }));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [account, itemsToSkip, networkId, pooltsTvlItems, getTVLById]);

  const handleShowMore = () => {
    setItemsToSkip((prev) => prev + COVERS_PER_PAGE);
  };

  return {
    handleShowMore,
    hasMore,
    data: {
      pools: data.pools,
    },
    loading,
  };
};
