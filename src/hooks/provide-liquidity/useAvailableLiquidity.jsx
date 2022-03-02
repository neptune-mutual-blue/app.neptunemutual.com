import { useState, useEffect } from "react";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";
import { AddressZero } from "@ethersproject/constants";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";
import { convertFromUnits } from "@/utils/bn";
import BigNumber from "bignumber.js";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";

export const useAvailableLiquidity = ({ coverKey }) => {
  const { library, account } = useWeb3React();
  const { networkId } = useAppContext();

  const [data, setData] = useState("0");
  const { notifyError } = useErrorNotifier();
  const { invoke } = useInvokeMethod();

  useEffect(() => {
    let ignore = false;

    if (!networkId || !coverKey) {
      return;
    }

    const signerOrProvider = getProviderOrSigner(
      library,
      account || AddressZero,
      networkId
    );

    async function fetchAvailableLiquidity() {
      try {
        const instance = await registry.PolicyContract.getInstance(
          networkId,
          signerOrProvider
        );

        const args = [coverKey];
        const [totalPoolAmount, totalCommitment] = await invoke(
          instance,
          "getCoverPoolSummary",
          {},
          notifyError,
          args,
          false
        );

        const availableLiquidity = BigNumber(totalPoolAmount.toString())
          .minus(totalCommitment.toString())
          .toString();
        if (ignore) return;

        setData(convertFromUnits(availableLiquidity).toString());
      } catch (error) {
        console.error(error);
      }
    }

    fetchAvailableLiquidity();
    return () => {
      ignore = true;
    };
  }, [account, coverKey, library, networkId]);

  return {
    availableLiquidity: data,
  };
};
