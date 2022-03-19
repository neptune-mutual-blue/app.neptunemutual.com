import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { registry } from "@neptunemutual/sdk";

export const useTokenName = (tokenAddress) => {
  const [tokenName, setTokenName] = useState("");

  const { networkId } = useNetwork();
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
      .name()
      .then((name) => {
        if (ignore) return;
        setTokenName(name);
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [account, library, networkId, tokenAddress]);

  return tokenName;
};
