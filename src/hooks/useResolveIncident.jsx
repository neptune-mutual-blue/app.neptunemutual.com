import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";
import { useAuthValidation } from "@/src/hooks/useAuthValidation";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useTxToast } from "@/src/hooks/useTxToast";
import { resolution } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";

export const useResolveIncident = ({ coverKey, incidentDate }) => {
  const { account, library } = useWeb3React();
  const { networkId } = useAppContext();
  const { requiresAuth } = useAuthValidation();

  const txToast = useTxToast();
  const { notifyError } = useErrorNotifier();

  const resolve = async () => {
    if (!networkId || !account) {
      requiresAuth();
      return;
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      const { result: tx } = await resolution.resolve(
        networkId,
        coverKey,
        incidentDate,
        signerOrProvider
      );

      await txToast.push(tx, {
        pending: "Resolving Incident",
        success: "Resolved Incident Successfully",
        failure: "Could not Resolve Incident",
      });
    } catch (err) {
      notifyError(err, "Resolve Incident");
    }
  };

  const emergencyResolve = async (decision) => {
    if (!networkId || !account) {
      requiresAuth();
      return;
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      const { result: tx } = await resolution.emergencyResolve(
        networkId,
        coverKey,
        incidentDate,
        decision,
        signerOrProvider
      );

      await txToast.push(tx, {
        pending: "Emergency Resolving Incident",
        success: "Emergency Resolved Incident Successfully",
        failure: "Could not Emergency Resolve Incident",
      });
    } catch (err) {
      notifyError(err, "Emergency Resolve Incident");
    }
  };

  return {
    resolve,
    emergencyResolve,
  };
};
