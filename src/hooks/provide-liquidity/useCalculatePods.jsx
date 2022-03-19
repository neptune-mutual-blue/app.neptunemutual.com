import { useEffect, useState } from "react";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";

import { convertToUnits, convertFromUnits, isValidNumber } from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";

export const useCalculatePods = ({ coverKey, value }) => {
  const { library, account } = useWeb3React();
  const { networkId } = useNetwork();

  const debouncedValue = useDebounce(value, 200);
  const [receiveAmount, setReceiveAmount] = useState("0");
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    let ignore = false;

    if (
      !networkId ||
      !account ||
      !debouncedValue ||
      !isValidNumber(debouncedValue)
    ) {
      if (receiveAmount !== "0") setReceiveAmount("0");

      return;
    }

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    async function exec() {
      try {
        const instance = await registry.Vault.getInstance(
          networkId,
          coverKey,
          signerOrProvider
        );

        const args = [convertToUnits(debouncedValue).toString()];
        const podAmount = await invoke(
          instance,
          "calculatePods",
          {},
          notifyError,
          args,
          false
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
