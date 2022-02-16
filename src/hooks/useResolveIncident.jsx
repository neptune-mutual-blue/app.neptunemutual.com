import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";
import { useAuthValidation } from "@/src/hooks/useAuthValidation";
import { resolution } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";

export const useResolveIncident = ({ coverKey, incidentDate }) => {
  const { account, library } = useWeb3React();
  const { networkId } = useAppContext();
  const { requiresAuth } = useAuthValidation();

  const resolve = () => {
    if (!networkId || !account) {
      requiresAuth();
      return;
    }

    const signerOrProvider = getProviderOrSigner(library, account, networkId);
    resolution.resolve(networkId, coverKey, incidentDate, signerOrProvider);
  };

  const emergencyResolve = (decision) => {
    if (!networkId || !account) {
      requiresAuth();
      return;
    }

    // TODO: remove this once the modal is implemented
    if (typeof decision !== "boolean") {
      throw Error("decision should be a boolean");
    }

    const signerOrProvider = getProviderOrSigner(library, account, networkId);
    resolution.emergencyResolve(
      networkId,
      coverKey,
      incidentDate,
      decision,
      signerOrProvider
    );
  };

  return {
    resolve,
    emergencyResolve,
  };
};
