import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { getCoverStatus } from "@/src/helpers/store/getCoverStatus";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

export const useCoverStatusInfo = (coverKey) => {
  const [statusInfo, setStatusInfo] = useState({
    activeIncidentDate: "0",
    status: "",
    requiresWhitelist: false,
  });
  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();

  useEffect(() => {
    if (!networkId || !coverKey || !account) return;

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    getCoverStatus(networkId, coverKey, signerOrProvider.provider)
      .then(setStatusInfo)
      .catch(console.error);
  }, [account, coverKey, library, networkId]);

  return statusInfo;
};
