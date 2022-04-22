import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { registry } from "@neptunemutual/sdk";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";

export const useTokenSymbol = (tokenAddress) => {
  const [tokenSymbol, setTokenSymbol] = useState("");

  const { networkId } = useNetwork();
  const { library, account } = useWeb3React();
  const { invoke } = useInvokeMethod();

  useEffect(() => {
    let ignore = false;
    if (!networkId || !tokenAddress) return;

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    const instance = registry.IERC20.getInstance(
      tokenAddress,
      signerOrProvider
    );

    if (!instance) {
      console.log(
        "Could not get an instance of token from the address %s",
        tokenAddress
      );

      return;
    }

    const onTransactionResult = (tx) => {
      const symbol = tx;
      if (ignore) return;
      setTokenSymbol(symbol);
    };

    const onRetryCancel = () => {};
    const onError = () => {};

    invoke({
      instance,
      methodName: "symbol",
      onTransactionResult,
      onRetryCancel,
      onError,
    });

    return () => {
      ignore = true;
    };
  }, [account, invoke, library, networkId, tokenAddress]);

  return tokenSymbol;
};
