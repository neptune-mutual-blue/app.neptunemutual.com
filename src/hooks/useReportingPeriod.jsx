import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { AddressZero } from "@ethersproject/constants";

import { useNetwork } from "@/src/context/Network";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { getReportingPeriod } from "@/src/helpers/store/getReportingPeriod";

export const useReportingPeriod = ({ coverKey }) => {
  const [reportingPeriod, setReportingPeriod] = useState("0");

  const { library, account } = useWeb3React();
  const { networkId } = useNetwork();

  useEffect(() => {
    if (!networkId || !coverKey || !account) return;

    const signerOrProvider = getProviderOrSigner(
      library,
      AddressZero,
      networkId
    );

    getReportingPeriod(networkId, coverKey, signerOrProvider.provider)
      .then((x) => setReportingPeriod(x))
      .catch((err) => console.error(err));
  }, [account, coverKey, library, networkId]);

  return {
    reportingPeriod,
  };
};
