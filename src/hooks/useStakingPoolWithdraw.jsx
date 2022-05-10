import { useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";
import { convertToUnits } from "@/utils/bn";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useNetwork } from "@/src/context/Network";
import { t } from "@lingui/macro";
import { txToast } from "@/src/store/toast";

export const useStakingPoolWithdraw = ({
  value,
  poolKey,
  tokenSymbol,
  refetchInfo,
}) => {
  const [withdrawing, setWithdrawing] = useState(false);

  const { networkId } = useNetwork();
  const { account, library } = useWeb3React();

  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  const handleWithdraw = async (onTxSuccess) => {
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
        await txToast({
          tx,
          titles: {
            pending: t`Unstaking ${tokenSymbol}`,
            success: t`Unstaked ${tokenSymbol} successfully`,
            failure: t`Could not unstake ${tokenSymbol}`,
          },
          options: { onTxSuccess },
          networkId,
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

  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  const handleWithdrawRewards = async (onTxSuccess) => {
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
        await txToast({
          tx,
          titles: {
            pending: t`Withdrawing rewards`,
            success: t`Withdrawn rewards successfully`,
            failure: t`Could not withdraw rewards`,
          },
          options: { onTxSuccess },
          networkId,
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
