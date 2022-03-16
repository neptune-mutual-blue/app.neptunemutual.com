import { useState, useEffect, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { registry } from "@neptunemutual/sdk";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";

export const useERC20Balance = (tokenAddress) => {
  const [balance, setBalance] = useState("0");
  const { networkId } = useAppContext();
  const { library, account } = useWeb3React();

  const fetchBalance = useCallback(async () => {
    if (!networkId || !account) return "0";
    if (!tokenAddress) return "0";

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const tokenInstance = registry.IERC20.getInstance(
        tokenAddress,
        signerOrProvider
      );

      if (!tokenInstance) {
        console.log("Could not get an instance of the ERC20 from the SDK");
      }

      return tokenInstance.balanceOf(account);
    } catch (e) {
      console.error(e);
    }

    return "0";
  }, [account, library, networkId, tokenAddress]);

  useEffect(() => {
    let ignore = false;

    fetchBalance().then((_bal) => {
      if (ignore) return;
      setBalance(_bal.toString());
    });

    return () => {
      ignore = true;
    };
  }, [fetchBalance]);

  const refetch = useCallback(async () => {
    const _balance = await fetchBalance();
    setBalance(_balance.toString());
  }, [fetchBalance]);

  return { balance, refetch };
};
