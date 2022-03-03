import { useEffect, useRef, useState } from "react";

import { useAppContext } from "@/src/context/AppWrapper";
import { useQuery } from "@/src/hooks/useQuery";
import { sumOf } from "@/utils/bn";
import { useAppConstants } from "@/src/context/AppConstants";
import { calcBondPoolTVL } from "@/src/helpers/bond";
import { calcStakingPoolTVL } from "@/src/helpers/pool";

const getQuery = () => {
  return `
  {
    pools {
      poolType
      rewardToken
      stakingToken
      rewardTokenDeposit
      totalRewardsWithdrawn
      totalStakingTokenDeposited
      totalStakingTokenWithdrawn
    }
    bondPools {
      address0
      values
      totalBondClaimed
      totalLpAddedToBond
    }
  }`;
};

export const usePoolTVL = () => {
  const [bondTVL, setBondTVL] = useState("0");
  const [stakingPoolTVL, setStakingPoolTVL] = useState("0");
  const mountedRef = useRef(false);

  const { networkId } = useAppContext();
  const { NPMTokenAddress } = useAppConstants();
  const { data: graphData, refetch } = useQuery();

  useEffect(() => {
    // Bond Pools TVL
    async function updateTVL() {
      if (!graphData || !NPMTokenAddress) return;

      const _tvl = await graphData.bondPools.reduce(async (acc, bondPool) => {
        const resolvedAcc = await acc;

        return sumOf(
          resolvedAcc,
          await calcBondPoolTVL(bondPool, networkId, NPMTokenAddress)
        ).toString();
      }, "0");

      if (!mountedRef.current) return;
      setBondTVL(_tvl);
    }

    updateTVL();
  }, [NPMTokenAddress, graphData, networkId]);

  useEffect(() => {
    // Staking and Pod Staking Pools TVL
    async function updateTVL() {
      if (!graphData) return;

      const _tvl = await graphData.pools.reduce(async (acc, currentPool) => {
        const resolvedAcc = await acc;

        return sumOf(
          resolvedAcc,
          await calcStakingPoolTVL(currentPool, networkId)
        ).toString();
      }, "0");

      if (!mountedRef.current) return;
      setStakingPoolTVL(_tvl);
    }

    updateTVL();
  }, [graphData, networkId]);

  useEffect(() => {
    mountedRef.current = true;
    refetch(getQuery());

    return () => {
      mountedRef.current = false;
    };
  }, [refetch]);

  return { tvl: sumOf(bondTVL, stakingPoolTVL).toString() };
};
