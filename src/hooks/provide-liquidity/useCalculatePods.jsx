import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { AddressZero } from "@ethersproject/constants";

import { convertToUnits, convertFromUnits, isValidNumber } from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useDebouncedEffect } from "@/src/hooks/useDebouncedEffect";
import { useAppContext } from "@/src/context/AppWrapper";
import { registry } from "@neptunemutual/sdk";

export const useCalculatePods = ({ coverKey, value }) => {
  const { library, account } = useWeb3React();
  const { networkId } = useAppContext();

  const [receiveAmount, setReceiveAmount] = useState("0");

  useDebouncedEffect(
    () => {
      let ignore = false;

      if (!networkId || !value || !isValidNumber(value)) {
        if (receiveAmount !== "0") setReceiveAmount("0");

        return;
      }

      const signerOrProvider = getProviderOrSigner(
        library,
        account || AddressZero,
        networkId
      );

      async function calculatePods() {
        try {
          const instance = await registry.Vault.getInstance(
            networkId,
            coverKey,
            signerOrProvider
          );

          const podAmount = await instance.calculatePods(
            convertToUnits(value).toString()
          );

          if (ignore) return;
          setReceiveAmount(convertFromUnits(podAmount).toString());
        } catch (error) {
          console.error(error);
        }
      }

      calculatePods();
      return () => {
        ignore = true;
      };
    },
    [account, coverKey, library, networkId, receiveAmount, value],
    500
  );

  return {
    receiveAmount,
  };
};
