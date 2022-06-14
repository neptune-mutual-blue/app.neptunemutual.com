import { useState } from "react";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useAuthValidation } from "@/src/hooks/useAuthValidation";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useTxToast } from "@/src/hooks/useTxToast";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";
import { t } from "@lingui/macro";

export const useFinalizeIncident = ({ coverKey, incidentDate }) => {
  const [finalizing, setFinalizing] = useState(false);

  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();
  const { requiresAuth } = useAuthValidation();

  const txToast = useTxToast();
  const { notifyError } = useErrorNotifier();
  const { invoke } = useInvokeMethod();

  const finalize = async () => {
    if (!networkId || !account) {
      requiresAuth();
      return;
    }

    setFinalizing(true);
    const cleanup = () => {
      setFinalizing(false);
    };

    const handleError = (err) => {
      notifyError(err, t`Finalize Incident`);
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      const instance = await registry.Resolution.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(tx, {
          pending: t`Finalizing Incident`,
          success: t`Finalized Incident Successfully`,
          failure: t`Could not Finalize Incident`,
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

      const productKey = null;
      const args = [coverKey, productKey, incidentDate];
      invoke({
        instance,
        methodName: "finalize",
        args,
        onTransactionResult,
        onRetryCancel,
        onError,
      });
    } catch (err) {
      handleError(err);
      cleanup();
    }
  };

  return {
    finalize,
    finalizing,
  };
};
