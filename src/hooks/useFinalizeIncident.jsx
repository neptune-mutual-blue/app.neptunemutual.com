import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";
import { resolution } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";

export const useFinalizeIncident = ({ coverKey, incidentDate }) => {
  const { account, library } = useWeb3React();
  const { networkId } = useAppContext();

  const finalize = () => {
    if (!networkId || !account) {
      return;
    }

    const signerOrProvider = getProviderOrSigner(library, account, networkId);
    resolution.finalize(networkId, coverKey, incidentDate, signerOrProvider);
  };

  return {
    finalize,
  };
};
