import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";
import { useAuthValidation } from "@/src/hooks/useAuthValidation";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useTxToast } from "@/src/hooks/useTxToast";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";

export const useFinalizeIncident = ({ coverKey, incidentDate }) => {
  const { account, library } = useWeb3React();
  const { networkId } = useAppContext();
  const { requiresAuth } = useAuthValidation();

  const txToast = useTxToast();
  const { notifyError } = useErrorNotifier();
  const { invoke } = useInvokeMethod();

  const finalize = async () => {
    if (!networkId || !account) {
      requiresAuth();
      return;
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      const instance = await registry.Resolution.getInstance(
        networkId,
        signerOrProvider
      );

      const args = [coverKey, incidentDate];
      const tx = await invoke(instance, "finalize", {}, notifyError, args);

      txToast.push(tx, {
        pending: "Finalizing Incident",
        success: "Finalized Incident Successfully",
        failure: "Could not Finalize Incident",
      });
    } catch (err) {
      notifyError(err, "Finalize Incident");
    }
  };

  return {
    finalize,
  };
};
