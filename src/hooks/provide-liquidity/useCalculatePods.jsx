import { useEffect, useState } from "react";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";
import { AddressZero } from "@ethersproject/constants";

import { convertToUnits, convertFromUnits, isValidNumber } from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";
import { useDebounce } from "@/src/hooks/useDebounce";

export const useCalculatePods = ({ coverKey, value }) => {
  const { library, account } = useWeb3React();
  const { networkId } = useAppContext();

  const debouncedValue = useDebounce(value, 200);
  const [receiveAmount, setReceiveAmount] = useState("0");

  useEffect(() => {
    let ignore = false;

    if (!networkId || !debouncedValue || !isValidNumber(debouncedValue)) {
      if (receiveAmount !== "0") setReceiveAmount("0");

      return;
    }

    const signerOrProvider = getProviderOrSigner(
      library,
      account || AddressZero,
      networkId
    );

    async function exec() {
      try {
        const instance = await registry.Vault.getInstance(
          networkId,
          coverKey,
          signerOrProvider
        );

        const podAmount = await instance.calculatePods(
          convertToUnits(debouncedValue).toString()
        );

        if (ignore) return;
        setReceiveAmount(convertFromUnits(podAmount).toString());
      } catch (error) {
        console.error(error);
      }
    }

    exec();
    return () => {
      ignore = true;
    };
  }, [account, coverKey, debouncedValue, library, networkId, receiveAmount]);

  return {
    receiveAmount,
  };
};
