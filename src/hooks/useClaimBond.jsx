import { useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useNetwork } from "@/src/context/Network";
import { t } from "@lingui/macro";

export const useClaimBond = () => {
  const [claiming, setClaiming] = useState();

  const { networkId } = useNetwork();
  const { account, library } = useWeb3React();
  const txToast = useTxToast();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  const handleClaim = async (onTxSuccess) => {
    if (!account || !networkId) {
      return;
    }

    setClaiming(true);
    const cleanup = () => {
      setClaiming(false);
    };
    const handleError = (err) => {
      notifyError(err, t`claim bond`);
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.BondPool.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(
          tx,
          {
            pending: t`Claiming NPM`,
            success: t`Claimed NPM Successfully`,
            failure: t`Could not claim bond`,
          },
          {
            onTxSuccess: onTxSuccess,
          }
        );
        cleanup();
      };

      const onRetryCancel = () => {
        cleanup();
      };

      const onError = (err) => {
        handleError(err);
        cleanup();
      };

      invoke({
        instance,
        methodName: "claimBond",
        onError,
        onTransactionResult,
        onRetryCancel,
      });
    } catch (err) {
      handleError(err);
      cleanup();
    }
  };

  return {
    claiming,
    handleClaim,
  };
};
