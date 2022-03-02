import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";
import { useAuthValidation } from "@/src/hooks/useAuthValidation";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useTxToast } from "@/src/hooks/useTxToast";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";

export const useResolveIncident = ({ coverKey, incidentDate }) => {
  const { account, library } = useWeb3React();
  const { networkId } = useAppContext();
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
      const catcher = notifyError;
      const args = [coverKey, incidentDate];

      const tx = await invoke(instance, "resolve", {}, catcher, args);

      await txToast.push(tx, {
        pending: "Resolving Incident",
        success: "Resolved Incident Successfully",
        failure: "Could not Resolve Incident",
      });
    } catch (err) {
      notifyError(err, "Resolve Incident");
    } finally {
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
      const catcher = notifyError;
      const args = [coverKey, incidentDate, decision];

      const tx = await invoke(instance, "emergencyResolve", {}, catcher, args);

      await txToast.push(tx, {
        pending: "Emergency Resolving Incident",
        success: "Emergency Resolved Incident Successfully",
        failure: "Could not Emergency Resolve Incident",
      });
    } catch (err) {
      notifyError(err, "Emergency Resolve Incident");
    } finally {
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
