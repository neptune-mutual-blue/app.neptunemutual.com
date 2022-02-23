import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { registry, liquidity } from "@neptunemutual/sdk";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { calculateGasMargin, convertToUnits } from "@/utils/bn";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useAppContext } from "@/src/context/AppWrapper";

export const useRemoveLiquidity = ({ coverKey, value }) => {
  const [vaultTokenAddress, setVaultTokenAddress] = useState();
  const { library, account } = useWeb3React();
  const { networkId } = useAppContext();
  const [balance, setBalance] = useState("0");
  const txToast = useTxToast();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    if (!networkId || !account) return;

    let ignore = false;
    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    // POD Balance
    liquidity
      .getBalanceOf(networkId, coverKey, signerOrProvider)
      .then(({ result }) => {
        if (ignore) return;
        setBalance(result);
      })
      .catch((e) => {
        console.error(e);
        if (ignore) return;
      });

    return () => (ignore = true);
  }, [account, networkId, coverKey, library]);

  useEffect(() => {
    if (!networkId || !account) return;

    let ignore = false;
    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    registry.Vault.getAddress(networkId, coverKey, signerOrProvider)
      .then((addr) => {
        if (ignore) return;
        setVaultTokenAddress(addr);
      })
      .catch((e) => {
        console.error(e);
        if (ignore) return;
      });

    return () => (ignore = true);
  }, [account, networkId, coverKey, library]);

  const handleWithdraw = async () => {
    if (!networkId || !account) return;

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    try {
      const instance = await registry.Vault.getInstance(
        networkId,
        coverKey,
        signerOrProvider
      );
      const estimatedGas = await instance.estimateGas
        .removeLiquidity(coverKey, convertToUnits(value).toString())
        .catch(() =>
          instance.estimateGas.removeLiquidity(
            coverKey,
            convertToUnits(value).toString(),
            "0"
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
      // console.error(error);
      notifyError(error, "remove liquidity");
    }
  };

  return {
    balance,
    vaultTokenAddress,
    handleWithdraw,
  };
};
