import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useAuthValidation } from "@/src/hooks/useAuthValidation";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useTxToast } from "@/src/hooks/useTxToast";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { t } from "@lingui/macro";

export const useResolveIncident = ({ coverKey, incidentDate }) => {
  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();
  const { invoke } = useInvokeMethod();
  const { requiresAuth } = useAuthValidation();

  const txToast = useTxToast();
  const { notifyError } = useErrorNotifier();

  const [resolving, setResolving] = useState(false);
  const [emergencyResolving, setEmergencyResolving] = useState(false);

  const resolve = async () => {
    if (!networkId || !account) {
      requiresAuth();
      return;
    }

    setResolving(true);

    const cleanup = () => {
      setResolving(false);
    };
    const handleError = (err) => {
      notifyError(err, t`Resolve Incident`);
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.Resolution.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(tx, {
          pending: t`Resolving Incident`,
          success: t`Resolved Incident Successfully`,
          failure: t`Could not Resolve Incident`,
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
        methodName: "resolve",
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

  const emergencyResolve = async (decision) => {
    if (!networkId || !account) {
      requiresAuth();
      return;
    }

    setEmergencyResolving(true);

    const cleanup = () => {
      setEmergencyResolving(false);
    };

    const handleError = (err) => {
      notifyError(err, t`Emergency Resolve Incident`);
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.Resolution.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(tx, {
          pending: t`Emergency Resolving Incident`,
          success: t`Emergency Resolved Incident Successfully`,
          failure: t`Could not Emergency Resolve Incident`,
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
      const args = [coverKey, productKey, incidentDate, decision];
      invoke({
        instance,
        methodName: "emergencyResolve",
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
    resolve,
    emergencyResolve,
    resolving,
    emergencyResolving,
  };
};
