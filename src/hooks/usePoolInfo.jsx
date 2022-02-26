import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";

import { useAppContext } from "@/src/context/AppWrapper";
import { ADDRESS_ONE } from "@/src/config/constants";

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
  lockupPeriodInBlocks: "0",
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
      account || ADDRESS_ONE,
      networkId
    );

    async function fetchPoolInfo() {
      try {
        let instance = await registry.StakingPools.getInstance(
          networkId,
          signerOrProvider
        );

        // eslint-disable-next-line array-element-newline
        const [name, addresses, values] = await instance.getInfo(
          key,
          account || ADDRESS_ONE
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
          lockupPeriodInBlocks,
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
          lockupPeriodInBlocks: lockupPeriodInBlocks.toString(),
          rewardTokenBalance: rewardTokenBalance.toString(),
          accountStakeBalance: accountStakeBalance.toString(),
          totalBlockSinceLastReward: totalBlockSinceLastReward.toString(),
          rewards: rewards.toString(),
          canWithdrawFrom: canWithdrawFrom.toString(),
          lastDepositHeight: lastDepositHeight.toString(),
          lastRewardHeight: lastRewardHeight.toString(),
        });
      } catch (err) {
        console.error(err);
      }
    }

    fetchPoolInfo();

    return () => {
      ignore = true;
    };
  }, [account, key, library, networkId]);

  return { info };
};
