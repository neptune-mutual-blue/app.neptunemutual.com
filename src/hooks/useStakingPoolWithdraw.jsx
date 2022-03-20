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

    setWithdrawing(true);

    const cleanup = () => {
      refetchInfo();
      setWithdrawing(false);
    };
    const handleError = (err) => {
      notifyError(err, `unstake ${tokenSymbol}`);
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

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
        cleanup();
      };

      const onRetryCancel = () => {
        cleanup();
      };

      const onError = (err) => {
        handleError(err);
        cleanup();
      };

      const args = [poolKey, convertToUnits(value).toString()];
      invoke({
        instance,
        methodName: "withdraw",
        onTransactionResult,
        onRetryCancel,
        onError,
        args,
      });
    } catch (err) {
      handleError(err);
      cleanup();
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

    setWithdrawingRewards(true);

    const cleanup = () => {
      refetchInfo();
      setWithdrawingRewards(false);
    };
    const handleError = (err) => {
      notifyError(err, "withdraw rewards");
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

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

        cleanup();
      };

      const onRetryCancel = () => {
        cleanup();
      };

      const onError = (err) => {
        handleError(err);
        cleanup();
      };

      const args = [poolKey];
      invoke({
        instance,
        methodName: "withdrawRewards",
        onTransactionResult,
        onRetryCancel,
        onError,
        args,
      });
    } catch (err) {
      handleError(err);
      cleanup();
    }
  };

  return {
    withdrawingRewards,
    handleWithdrawRewards,
  };
};
