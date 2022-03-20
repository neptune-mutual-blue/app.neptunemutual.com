import { useCallback, useEffect, useRef, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";

import { useNetwork } from "@/src/context/Network";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";

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
  const mountedRef = useRef(false);

  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  const fetchPoolInfo = useCallback(async () => {
    if (!networkId || !account || !key) {
      return;
    }

    const handleError = (err) => {
      notifyError(err, "get pool info");
    };

    const signerOrProvider = getProviderOrSigner(library, account, networkId);
    try {
      let instance = await registry.StakingPools.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = (result) => {
        const [name, addresses, values] = result;

        if (!mountedRef.current) return;

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
      };

      const onRetryCancel = () => {};
      const onError = (err) => {
        handleError(err);
      };

      const args = [key, account];
      invoke({
        instance,
        methodName: "getInfo",
        args,
        retry: false,
        onError,
        onTransactionResult,
        onRetryCancel,
      });
    } catch (err) {
      handleError(err);
    }
  }, [account, invoke, key, library, networkId, notifyError]);

  useEffect(() => {
    mountedRef.current = true;
    fetchPoolInfo();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchPoolInfo]);

  return { info, refetch: fetchPoolInfo };
};
