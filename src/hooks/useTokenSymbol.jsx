import { Contract } from "@ethersproject/contracts";
import { useEffect, useState } from "react";
import { AddressZero } from "@ethersproject/constants";
import { useWeb3React } from "@web3-react/core";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";
import IERC20 from "../config/contracts/abis/IERC20.json";

export const useTokenSymbol = (tokenAddress) => {
  const [tokenSymbol, setTokenSymbol] = useState("");

  const { networkId } = useAppContext();
  const { library, account } = useWeb3React();

  useEffect(() => {
    let ignore = false;
    if (!networkId || !tokenAddress) return;

    const signerOrProvider = getProviderOrSigner(
      library,
      account || AddressZero,
      networkId
    );

    const instance = new Contract(tokenAddress, IERC20, signerOrProvider);

    if (!instance) {
      console.log("instance not found");
      return;
    }
    console.log("instance found");

    instance
      .symbol()
      .then((symbol) => {
        if (ignore) return;
        setTokenSymbol(symbol);
      })
      .catch(console.error);

    return () => (ignore = true);
  }, [networkId, tokenAddress]);

  return tokenSymbol;
};
