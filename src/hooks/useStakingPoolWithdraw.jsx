import { useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";
import { convertToUnits } from "@/utils/bn";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useNetwork } from "@/src/context/Network";
import { t } from "@lingui/macro";

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
      notifyError(err, t`unstake ${tokenSymbol}`);
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.StakingPools.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(tx, {
          pending: t`Unstaking ${tokenSymbol}`,
          success: t`Unstaked ${tokenSymbol} successfully`,
          failure: t`Could not unstake ${tokenSymbol}`,
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

export const useStakingPoolWithdrawRewards = ({
  poolKey,
  refetchInfo,
  onWithdrawSuccess = (_) => {},
}) => {
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
      notifyError(err, t`withdraw rewards`);
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.StakingPools.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        const result = await txToast.push(tx, {
          pending: t`Withdrawing rewards`,
          success: t`Withdrawn rewards successfully`,
          failure: t`Could not withdraw rewards`,
        });

        cleanup();
        if (result?.success && onWithdrawSuccess) {
          onWithdrawSuccess(tx);
        }
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
