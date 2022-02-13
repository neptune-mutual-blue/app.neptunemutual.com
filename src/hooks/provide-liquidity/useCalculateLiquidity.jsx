import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { AddressZero } from "@ethersproject/constants";

import { convertToUnits, isValidNumber } from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useDebouncedEffect } from "@/src/hooks/useDebouncedEffect";
import { useAppContext } from "@/src/context/AppWrapper";
import { registry } from "@neptunemutual/sdk";

export const useCalculateLiquidity = ({ coverKey, podAmount }) => {
  const { library, account } = useWeb3React();
  const { networkId } = useAppContext();

  const [receiveAmount, setReceiveAmount] = useState("0");

  useDebouncedEffect(
    () => {
      let ignore = false;

      if (!networkId || !podAmount || !isValidNumber(podAmount)) {
        if (receiveAmount !== "0") setReceiveAmount("0");

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
            convertToUnits(podAmount).toString()
          );

          if (ignore) return;
          setReceiveAmount(liquidityAmount);
        } catch (error) {
          console.error(error);
        }
      }

      calculateLiquidity();
      return () => (ignore = true);
    },
    [account, coverKey, library, networkId, receiveAmount, podAmount],
    500
  );

  return {
    receiveAmount,
  };
};
