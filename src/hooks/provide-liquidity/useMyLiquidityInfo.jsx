import { useState, useEffect, useCallback } from "react";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useTxToast } from "@/src/hooks/useTxToast";
import DateLib from "@/lib/date/DateLib";
import { isGreater } from "@/utils/bn";

const defaultInfo = {
  totalPods: "0",
  balance: "0",
  extendedBalance: "0",
  totalReassurance: "0",
  myPodBalance: "0",
  myDeposits: "0",
  myWithdrawals: "0",
  myShare: "0",
  withdrawalOpen: "0",
  withdrawalClose: "0",
};
export const useMyLiquidityInfo = ({ coverKey }) => {
  const [info, setInfo] = useState(defaultInfo);

  const { library, account } = useWeb3React();
  const { networkId } = useNetwork();
  const txToast = useTxToast();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  const fetchInfo = useCallback(
    async (onResult) => {
      if (!networkId || !account || !coverKey) {
        return;
      }

      const handleError = (err) => {
        notifyError(err, "get liquidity info");
      };

      try {
        const signerOrProvider = getProviderOrSigner(
          library,
          account,
          networkId
        );

        const instance = await registry.Vault.getInstance(
          networkId,
          coverKey,
          signerOrProvider
        );

        const onTransactionResult = (result) => {
          const [
            totalPods,
            balance,
            extendedBalance,
            totalReassurance,
            myPodBalance,
            myDeposits,
            myWithdrawals,
            myShare,
            withdrawalOpen,
            withdrawalClose,
          ] = result;

          onResult({
            totalPods: totalPods.toString(),
            balance: balance.toString(),
            extendedBalance: extendedBalance.toString(),
            totalReassurance: totalReassurance.toString(),
            myPodBalance: myPodBalance.toString(),
            myDeposits: myDeposits.toString(),
            myWithdrawals: myWithdrawals.toString(),
            myShare: myShare.toString(),
            withdrawalOpen: withdrawalOpen.toString(),
            withdrawalClose: withdrawalClose.toString(),
          });
        };

        const onRetryCancel = () => {};

        const onError = (err) => {
          handleError(err);
        };

        const args = [account];
        invoke({
          instance,
          methodName: "getInfo",
          args,
          retry: false,
          onTransactionResult,
          onRetryCancel,
          onError,
        });
      } catch (err) {
        handleError(err);
      }
    },
    [account, coverKey, invoke, library, networkId, notifyError]
  );

  useEffect(() => {
    let ignore = false;

    const onResult = (_info) => {
      if (!_info || ignore) return;
      setInfo(_info);
    };

    fetchInfo(onResult).catch(console.error);
    return () => {
      ignore = true;
    };
  }, [fetchInfo]);

  const updateInfo = useCallback(async () => {
    const onResult = (_info) => {
      if (!_info) return;
      setInfo(_info);
    };

    fetchInfo(onResult).catch(console.error);
  }, [fetchInfo]);

  const accrueInterest = async () => {
    const handleError = (err) => {
      notifyError(err, "accrue interest");
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.Vault.getInstance(
        networkId,
        coverKey,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(tx, {
          pending: "Accruing intrest",
          success: "Accrued intrest successfully",
          failure: "Could not accrue interest",
        });
      };

      const onRetryCancel = () => {};
      const onError = (err) => {
        handleError(err);
      };

      invoke({
        instance,
        methodName: "accrueInterest",
        onTransactionResult,
        onRetryCancel,
        onError,
      });
    } catch (err) {
      handleError(err);
    }
  };

  const now = DateLib.unix();
  const isWithdrawalWindowOpen =
    account &&
    isGreater(now, info.withdrawalOpen) &&
    isGreater(info.withdrawalClose, now);

  return {
    info,

    isWithdrawalWindowOpen: isWithdrawalWindowOpen,
    accrueInterest,

    refetch: updateInfo,
  };
};
