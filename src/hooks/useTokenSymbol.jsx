import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";
import { registry } from "@neptunemutual/sdk";

export const useTokenSymbol = (tokenAddress) => {
  const [tokenSymbol, setTokenSymbol] = useState("");

  const { networkId } = useAppContext();
  const { library, account } = useWeb3React();

  useEffect(() => {
    let ignore = false;
    if (!networkId || !account || !tokenAddress) return;

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

    instance
      .symbol()
      .then((symbol) => {
        if (ignore) return;
        setTokenSymbol(symbol);
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [account, library, networkId, tokenAddress]);

  return tokenSymbol;
};
