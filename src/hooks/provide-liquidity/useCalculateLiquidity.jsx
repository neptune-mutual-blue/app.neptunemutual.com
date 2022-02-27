import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { AddressZero } from "@ethersproject/constants";

import { convertToUnits, isValidNumber } from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";
import { registry } from "@neptunemutual/sdk";
import { useDebounce } from "@/src/hooks/useDebounce";

export const useCalculateLiquidity = ({ coverKey, podAmount }) => {
  const { library, account } = useWeb3React();
  const { networkId } = useAppContext();

  const debouncedValue = useDebounce(podAmount, 200);
  const [receiveAmount, setReceiveAmount] = useState("0");

  useEffect(() => {
    let ignore = false;

    if (!networkId || !debouncedValue || !isValidNumber(debouncedValue)) {
      if (receiveAmount !== "0" && !ignore) setReceiveAmount("0");

      return;
    }

    const signerOrProvider = getProviderOrSigner(
      library,
      account || AddressZero,
      networkId
    );

    async function calculateLiquidity() {
      try {
        const instance = await registry.Vault.getInstance(
          networkId,
          coverKey,
          signerOrProvider
        );

        const liquidityAmount = await instance.calculateLiquidity(
          convertToUnits(debouncedValue).toString()
        );

        if (ignore) return;
        setReceiveAmount(liquidityAmount);
      } catch (error) {
        console.error(error);
      }
    }

    calculateLiquidity();
    return () => {
      ignore = true;
    };
  }, []);

  return {
    receiveAmount,
  };
};
