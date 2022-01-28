import { useState, useEffect } from "react";
import { liquidity, registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";

import {
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
} from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useLiquidityBalance } from "@/src/hooks/useLiquidityBalance";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";

export const useProvideLiquidity = ({ coverKey, value }) => {
  const [allowance, setAllowance] = useState();
  const [approving, setApproving] = useState();
  const [providing, setProviding] = useState();
  const [vaultAddress, setVaultAddress] = useState("");
  const podSymbol = useTokenSymbol(vaultAddress);

  const txToast = useTxToast();

  const { library, account, chainId } = useWeb3React();
  const { balance } = useLiquidityBalance();

  useEffect(() => {
    if (!chainId || !account) return;

    let ignore = false;
    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    registry.Vault.getAddress(chainId, coverKey, signerOrProvider)
      .then((addr) => {
        if (ignore) return;
        return setVaultAddress(addr);
      })
      .catch(console.error);

    return () => (ignore = true);
  }, [chainId, account, library, coverKey]);

  useEffect(() => {
    if (!chainId || !account) return;

    let ignore = false;
    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    liquidity
      .getAllowance(chainId, coverKey, account, signerOrProvider)
      .then(({ result }) => {
        if (ignore) return;
        setAllowance(result);
      })
      .catch((e) => {
        console.error(e);
        if (ignore) return;
      });

    return () => (ignore = true);
  }, [account, chainId, library, coverKey]);

  const checkAllowance = async () => {
    if (!chainId || !account) return;

    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    try {
      const { result: _allowance } = await liquidity.getAllowance(
        chainId,
        coverKey,
        account,
        signerOrProvider
      );

      setAllowance(_allowance);
    } catch (e) {
      console.error(e);
    }
  };

  const handleApprove = async () => {
    try {
      setApproving(true);
      const signerOrProvider = getProviderOrSigner(library, account, chainId);

      const { result: tx } = await liquidity.approve(
        chainId,
        coverKey,
        {},
        signerOrProvider
      );

      await txToast.push(tx, {
        pending: "Approving DAI",
        success: "Approved DAI Successfully",
        failure: "Could not approve DAI",
      });

      setApproving(false);
      checkAllowance();
    } catch (error) {
      setApproving(false);
    }
  };

  const handleProvide = async () => {
    try {
      setProviding(true);

      const signerOrProvider = getProviderOrSigner(library, account, chainId);
      const amount = convertToUnits(value).toString();

      const { result: tx } = await liquidity.add(
        chainId,
        coverKey,
        amount,
        signerOrProvider
      );

      await txToast.push(tx, {
        pending: "Adding Liquidity",
        success: "Added Liquidity Successfully",
        failure: "Could not add liquidity",
      });

      setProviding(false);
    } catch (error) {
      setProviding(false);
    }
  };

  const canProvideLiquidity =
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(allowance || "0", convertToUnits(value || "0"));
  const isError =
    value &&
    (!isValidNumber(value) ||
      isGreater(convertToUnits(value || "0"), balance || "0"));

  return {
    balance,
    canProvideLiquidity,
    isError,
    approving,
    providing,
    handleApprove,
    handleProvide,
    podSymbol,
  };
};
