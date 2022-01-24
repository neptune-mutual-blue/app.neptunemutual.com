import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";

import { AddressZero } from "@ethersproject/constants";
import { useAppContext } from "@/src/context/AppWrapper";

const defaultInfo = {
  name: "",

  stakingToken: "",
  stakingTokenStablecoinPair: "",
  rewardToken: "",
  rewardTokenStablecoinPair: "",

  totalStaked: "0",
  target: "0",
  maximumStake: "0",
  stakeBalance: "0",
  cumulativeDeposits: "0",
  rewardPerBlock: "0",
  platformFee: "0",
  lockupPeriod: "0",
  rewardTokenBalance: "0",
  accountStakeBalance: "0",
  totalBlockSinceLastReward: "0",
  rewards: "0",
  canWithdrawFrom: "0",
  lastDepositHeight: "0",
  lastRewardHeight: "0",
};

export const usePoolInfo = ({ key }) => {
  const [info, setInfo] = useState(defaultInfo);

  const { account, library } = useWeb3React();
  const { networkId } = useAppContext();

  useEffect(() => {
    let ignore = false;
    if (!networkId) {
      return;
    }

    const signerOrProvider = getProviderOrSigner(
      library,
      account || AddressZero,
      networkId
    );

    async function fetchBondInfo() {
      let instance = await registry.StakingPools.getInstance(
        networkId,
        signerOrProvider
      );

      // prettier-ignore
      const [
        name,
        addresses,
        values
      ] = await instance.getInfo(
        key,
        account || AddressZero
      );

      if (ignore) return;

      const [
        stakingToken,
        stakingTokenStablecoinPair,
        rewardToken,
        rewardTokenStablecoinPair,
      ] = addresses;
      const [
        totalStaked,
        target,
        maximumStake,
        stakeBalance,
        cumulativeDeposits,
        rewardPerBlock,
        platformFee,
        lockupPeriod,
        rewardTokenBalance,
        accountStakeBalance,
        totalBlockSinceLastReward,
        rewards,
        canWithdrawFrom,
        lastDepositHeight,
        lastRewardHeight,
      ] = values;

      setInfo({
        name,

        stakingToken,
        stakingTokenStablecoinPair,
        rewardToken,
        rewardTokenStablecoinPair,

        totalStaked: totalStaked.toString(),
        target: target.toString(),
        maximumStake: maximumStake.toString(),
        stakeBalance: stakeBalance.toString(),
        cumulativeDeposits: cumulativeDeposits.toString(),
        rewardPerBlock: rewardPerBlock.toString(),
        platformFee: platformFee.toString(),
        lockupPeriod: lockupPeriod.toString(),
        rewardTokenBalance: rewardTokenBalance.toString(),
        accountStakeBalance: accountStakeBalance.toString(),
        totalBlockSinceLastReward: totalBlockSinceLastReward.toString(),
        rewards: rewards.toString(),
        canWithdrawFrom: canWithdrawFrom.toString(),
        lastDepositHeight: lastDepositHeight.toString(),
        lastRewardHeight: lastRewardHeight.toString(),
      });
    }

    fetchBondInfo();

    return () => (ignore = true);
  }, [account, key, library, networkId]);

  return { info };
};
