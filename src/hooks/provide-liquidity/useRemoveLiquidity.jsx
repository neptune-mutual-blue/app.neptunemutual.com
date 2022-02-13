import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { registry, liquidity } from "@neptunemutual/sdk";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { calculateGasMargin, convertToUnits } from "@/utils/bn";
import { useTxToast } from "@/src/hooks/useTxToast";

export const useRemoveLiquidity = ({ coverKey, value }) => {
  const [vaultTokenAddress, setVaultTokenAddress] = useState();
  const { library, account, chainId } = useWeb3React();
  const [balance, setBalance] = useState();
  const txToast = useTxToast();

  useEffect(() => {
    if (!chainId || !account) return;

    let ignore = false;
    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    // POD Balance
    liquidity
      .getBalance(chainId, coverKey, signerOrProvider)
      .then(({ result }) => {
        if (ignore) return;
        setBalance(result);
      })
      .catch((e) => {
        console.error(e);
        if (ignore) return;
      });

    return () => (ignore = true);
  }, [account, chainId, coverKey, library]);

  useEffect(() => {
    if (!chainId || !account) return;

    let ignore = false;
    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    registry.Vault.getAddress(chainId, coverKey, signerOrProvider)
      .then((addr) => {
        if (ignore) return;
        setVaultTokenAddress(addr);
      })
      .catch((e) => {
        console.error(e);
        if (ignore) return;
      });

    return () => (ignore = true);
  }, [account, chainId, coverKey, library]);

  const handleWithdraw = async () => {
    if (!chainId || !account) return;

    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    try {
      const instance = await registry.Vault.getInstance(
        chainId,
        coverKey,
        signerOrProvider
      );
      const estimatedGas = await instance.estimateGas
        .removeLiquidity(coverKey, convertToUnits(value).toString())
        .catch(() =>
          instance.estimateGas.removeLiquidity(
            coverKey,
            convertToUnits(value).toString()
          )
        );

      const tx = await instance.removeLiquidity(
        coverKey,
        convertToUnits(value).toString(),
        {
          gasLimit: calculateGasMargin(estimatedGas),
        }
      );

      await txToast.push(tx, {
        pending: "Removing Liquidity",
        success: "Removed Liquidity Successfully",
        failure: "Could not remove liquidity",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    balance,
    vaultTokenAddress,
    handleWithdraw,
  };
};
