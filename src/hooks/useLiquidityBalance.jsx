import { useState, useEffect, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { registry } from "@neptunemutual/sdk";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { ZERO_BI } from "@/utils/bn";

export const useLiquidityBalance = () => {
  const [balance, setBalance] = useState();
  const { library, account, chainId } = useWeb3React();

  const fetchBalance = useCallback(async () => {
    if (!chainId || !account) return ZERO_BI;

    try {
      const signerOrProvider = getProviderOrSigner(library, account, chainId);

      const liquidityTokenInstance = await registry.LiquidityToken.getInstance(
        chainId,
        signerOrProvider
      );

      if (!liquidityTokenInstance) {
        console.log("No instance found");
      }

      return liquidityTokenInstance.balanceOf(account);
    } catch (e) {
      console.error(e);
    }

    return ZERO_BI;
  }, [account, chainId, library]);

  useEffect(() => {
    let ignore = false;

    fetchBalance().then((_balance) => {
      if (ignore) return;
      setBalance(_balance);
    });

    return () => (ignore = true);
  }, [fetchBalance]);

  return { balance };
};
