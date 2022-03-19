import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useAuthValidation } from "@/src/hooks/useAuthValidation";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useTxToast } from "@/src/hooks/useTxToast";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";

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

    try {
      setResolving(true);
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.Resolution.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(tx, {
          pending: "Resolving Incident",
          success: "Resolved Incident Successfully",
          failure: "Could not Resolve Incident",
        });
        setResolving(false);
      };

      const args = [coverKey, incidentDate];
      invoke({
        instance,
        methodName: "resolve",
        catcher: notifyError,
        args,
        onTransactionResult,
      });
    } catch (err) {
      notifyError(err, "Resolve Incident");
      setResolving(false);
    }
  };

  const emergencyResolve = async (decision) => {
    if (!networkId || !account) {
      requiresAuth();
      return;
    }

    try {
      setEmergencyResolving(true);
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.Resolution.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(tx, {
          pending: "Emergency Resolving Incident",
          success: "Emergency Resolved Incident Successfully",
          failure: "Could not Emergency Resolve Incident",
        });
        setEmergencyResolving(false);
      };

      const args = [coverKey, incidentDate, decision];
      invoke({
        instance,
        methodName: "emergencyResolve",
        catcher: notifyError,
        onTransactionResult,
        args,
      });
    } catch (err) {
      notifyError(err, "Emergency Resolve Incident");
      setEmergencyResolving(false);
    }
  };

  return {
    resolve,
    emergencyResolve,
    resolving,
    emergencyResolving,
  };
};
