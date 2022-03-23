import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { AddressZero } from "@ethersproject/constants";

import { useNetwork } from "@/src/context/Network";
import { getReporterCommission } from "@/src/helpers/store/getReporterCommission";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import BigNumber from "bignumber.js";
import { MULTIPLIER } from "@/src/config/constants";

export const useReporterCommission = () => {
  const [commission, setCommission] = useState("0");

  const { library } = useWeb3React();
  const { networkId } = useNetwork();

  useEffect(() => {
    if (!networkId) return;

    const signerOrProvider = getProviderOrSigner(
      library,
      AddressZero,
      networkId
    );

    getReporterCommission(networkId, signerOrProvider.provider).then(
      (_commission) => {
        setCommission(
          BigNumber(_commission.toString())
            .multipliedBy(100)
            .dividedBy(MULTIPLIER)
            .decimalPlaces(3)
            .toString()
        );
      }
    );
  }, [library, networkId]);

  return {
    commission,
  };
};
