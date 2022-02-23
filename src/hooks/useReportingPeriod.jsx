import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { AddressZero } from "@ethersproject/constants";

import { useAppContext } from "@/src/context/AppWrapper";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { getReportingPeriod } from "@/src/helpers/store/getReportingPeriod";

export const useReportingPeriod = ({ coverKey }) => {
  const [reportingPeriod, setReportingPeriod] = useState("0");

  const { library } = useWeb3React();
  const { networkId } = useAppContext();

  useEffect(() => {
    if (!networkId) return;

    const signerOrProvider = getProviderOrSigner(
      library,
      AddressZero,
      networkId
    );

    getReportingPeriod(networkId, coverKey, signerOrProvider.provider)
      .then((x) => setReportingPeriod(x))
      .catch(console.error);
  }, [coverKey, library, networkId]);

  return {
    reportingPeriod,
  };
};
