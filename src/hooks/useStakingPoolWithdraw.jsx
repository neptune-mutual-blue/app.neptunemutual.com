import { useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";
import { convertToUnits } from "@/utils/bn";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useNetwork } from "@/src/context/Network";

export const useStakingPoolWithdraw = ({
  value,
  poolKey,
  tokenSymbol,
  refetchInfo,
}) => {
  const [withdrawing, setWithdrawing] = useState(false);

  const { networkId } = useNetwork();
  const { account, library } = useWeb3React();

  const txToast = useTxToast();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  const handleWithdraw = async () => {
    if (!account || !networkId) {
      return;
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      setWithdrawing(true);
      const instance = await registry.StakingPools.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(tx, {
          pending: `Unstaking ${tokenSymbol}`,
          success: `Unstaked ${tokenSymbol} successfully`,
          failure: `Could not unstake ${tokenSymbol}`,
        });

        refetchInfo();
        setWithdrawing(false);
      };

      const args = [poolKey, convertToUnits(value).toString()];
      invoke({
        instance,
        methodName: "withdraw",
        catcher: notifyError,
        onTransactionResult,
        args,
      });
    } catch (err) {
      notifyError(err, `unstake ${tokenSymbol}`);
      setWithdrawing(false);
    }
  };

  return {
    withdrawing,
    handleWithdraw,
  };
};

export const useStakingPoolWithdrawRewards = ({ poolKey, refetchInfo }) => {
  const [withdrawingRewards, setWithdrawingRewards] = useState(false);

  const { networkId } = useNetwork();
  const { account, library } = useWeb3React();

  const txToast = useTxToast();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  const handleWithdrawRewards = async () => {
    if (!account || !networkId) {
      return;
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      setWithdrawingRewards(true);
      const instance = await registry.StakingPools.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(tx, {
          pending: `Withdrawing rewards`,
          success: `Withdrawn rewards successfully`,
          failure: `Could not withdraw rewards`,
        });

        refetchInfo();
        setWithdrawingRewards(false);
      };

      const args = [poolKey];
      invoke({
        instance,
        methodName: "withdrawRewards",
        catcher: notifyError,
        onTransactionResult,
        args,
      });
    } catch (err) {
      console.error(err);
      setWithdrawingRewards(false);
    }
  };

  return {
    withdrawingRewards,
    handleWithdrawRewards,
  };
};
