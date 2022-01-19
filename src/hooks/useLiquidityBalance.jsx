import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { registry } from "@neptunemutual/sdk";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";

export const useLiquidityBalance = () => {
  const [balance, setBalance] = useState();
  const { library, account, chainId } = useWeb3React();

  useEffect(() => {
    let ignore = false;
    if (!chainId || !account) return;

    async function fetchBalance() {
      const signerOrProvider = getProviderOrSigner(library, account, chainId);

      const liquidityTokenInstance = await registry.LiquidityToken.getInstance(
        chainId,
        signerOrProvider
      );

      if (!liquidityTokenInstance) {
        console.log("No instance found");
      }

      try {
        const bal = await liquidityTokenInstance.balanceOf(account);
        if (ignore) return;
        setBalance(bal);
      } catch (e) {
        console.error(e);
      }
    }

    fetchBalance();

    return () => (ignore = true);
  }, [account, chainId, library]);

  return { balance };
};
