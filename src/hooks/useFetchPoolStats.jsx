import { useState, useEffect } from "react";
import { getGraphURL } from "@/src/config/environment";
import { useAppContext } from "@/src/context/AppWrapper";
import { sumOf } from "@/utils/bn";

const defaultData = {
  tvl: "0",
};

export const useFetchPoolStats = ({ key }) => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const { networkId } = useAppContext();

  useEffect(() => {
    if (!networkId || !key) {
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
          pool (id: "${key}") {
            poolType
            rewardToken
            stakingToken
            rewardTokenDeposit
            totalRewardsWithdrawn
            totalStakingTokenDeposited
            totalStakingTokenWithdrawn
          }
        }
        `,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.errors) {
          return;
        }

        const rewardAmount = sumOf(res.data.pool.rewardTokenDeposit)
          .minus(res.data.pool.totalRewardsWithdrawn)
          .toString();

        const stakingTokenAmount = sumOf(
          res.data.pool.totalStakingTokenDeposited
        )
          .minus(res.data.pool.totalStakingTokenWithdrawn)
          .toString();

        setData({
          tvl: sumOf(rewardAmount, stakingTokenAmount).toString(),
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [key, networkId]);

  return {
    data,
    loading,
  };
};
