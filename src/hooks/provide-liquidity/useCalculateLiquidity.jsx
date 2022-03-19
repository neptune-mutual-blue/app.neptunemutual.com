import { useCallback, useEffect, useRef, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { convertToUnits, isValidNumber } from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { registry } from "@neptunemutual/sdk";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";

export const useCalculateLiquidity = ({ coverKey, podAmount }) => {
  const mountedRef = useRef(false);
  const { library, account } = useWeb3React();
  const { networkId } = useNetwork();

  const debouncedValue = useDebounce(podAmount, 200);
  const [receiveAmount, setReceiveAmount] = useState("0");
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  const calculateLiquidity = useCallback(async () => {
    if (
      !networkId ||
      !account ||
      !debouncedValue ||
      !isValidNumber(debouncedValue)
    ) {
      return;
    }

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    try {
      const instance = await registry.Vault.getInstance(
        networkId,
        coverKey,
        signerOrProvider
      );

      const onTransactionResult = (result) => {
        const liquidityAmount = result;

        if (!mountedRef.current) return;
        setReceiveAmount(liquidityAmount);
      };

      const args = [convertToUnits(debouncedValue).toString()];
      invoke({
        instance,
        methodName: "calculateLiquidity",
        catcher: notifyError,
        onTransactionResult,
        args,
        retry: false,
      });
    } catch (error) {
      notifyError(error, "calculate liquidity");
    }
  }, [
    account,
    coverKey,
    debouncedValue,
    invoke,
    library,
    networkId,
    notifyError,
  ]);

  useEffect(() => {
    mountedRef.current = true;

    calculateLiquidity();

    return () => {
      mountedRef.current = false;
    };
  }, [calculateLiquidity]);

  return {
    receiveAmount,
  };
};
