import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";
import { useAuthValidation } from "@/src/hooks/useAuthValidation";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useTxToast } from "@/src/hooks/useTxToast";
import { resolution } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";

export const useFinalizeIncident = ({ coverKey, incidentDate }) => {
  const { account, library } = useWeb3React();
  const { networkId } = useAppContext();
  const { requiresAuth } = useAuthValidation();

  const txToast = useTxToast();
  const { notifyError } = useErrorNotifier();

  const finalize = async () => {
    if (!networkId || !account) {
      requiresAuth();
      return;
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      const { result: tx } = await resolution.finalize(
        networkId,
        coverKey,
        incidentDate,
        signerOrProvider
      );

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
