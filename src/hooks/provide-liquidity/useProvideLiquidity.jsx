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
import { useNPMBalance } from "@/src/hooks/useNPMBalance";

export const useProvideLiquidity = ({ coverKey, lqValue, npmValue }) => {
  const [lqTokenAllowance, setLqTokenAllowance] = useState();
  const [npmTokenAllowance, setNPMTokenAllowance] = useState();
  const [lqApproving, setLqApproving] = useState();
  const [npmApproving, setNPMApproving] = useState();
  const [providing, setProviding] = useState();
  const [vaultAddress, setVaultAddress] = useState("");
  const podSymbol = useTokenSymbol(vaultAddress);

  const txToast = useTxToast();

  const { library, account, chainId } = useWeb3React();
  const { balance: lqTokenBalance } = useLiquidityBalance();
  const { balance: npmBalance } = useNPMBalance();

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
        setLqTokenAllowance(result);
      })
      .catch((e) => {
        console.error(e);
        if (ignore) return;
      });

    checkNPMTokenAllowance();

    return () => (ignore = true);
  }, [account, chainId, library, coverKey]);

  const checkLqTokenAllowance = async () => {
    if (!chainId || !account) return;

    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    try {
      const { result: _allowance } = await liquidity.getAllowance(
        chainId,
        coverKey,
        account,
        signerOrProvider
      );

      setLqTokenAllowance(_allowance);
    } catch (e) {
      console.error(e);
    }
  };

  const checkNPMTokenAllowance = async () => {
    if (!chainId || !account) return;

    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    try {
      const vault = await registry.Vault.getAddress(
        chainId,
        coverKey,
        signerOrProvider
      );

      const npmInstance = await registry.NPMToken.getInstance(
        chainId,
        signerOrProvider
      );
      const _allowance = await npmInstance.allowance(account, vault);

      setNPMTokenAllowance(_allowance);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLqTokenApprove = async () => {
    try {
      setLqApproving(true);
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

      setLqApproving(false);
      checkLqTokenAllowance();
    } catch (error) {
      setLqApproving(false);
    }
  };

  const handleNPMTokenApprove = async () => {
    try {
      setNPMApproving(true);
      const signerOrProvider = getProviderOrSigner(library, account, chainId);

      const { result: tx } = await liquidity.approveStake(
        chainId,
        coverKey,
        {},
        signerOrProvider
      );

      await txToast.push(tx, {
        pending: "Approving NPM",
        success: "Approved NPM Successfully",
        failure: "Could not approve NPM",
      });

      setNPMApproving(false);
      checkNPMTokenAllowance();
    } catch (error) {
      setNPMApproving(false);
    }
  };

  const handleProvide = async () => {
    try {
      setProviding(true);

      const signerOrProvider = getProviderOrSigner(library, account, chainId);
      const lqAmount = convertToUnits(lqValue).toString();
      const npmAmount = convertToUnits(npmValue).toString();

      const { result: tx } = await liquidity.add(
        chainId,
        coverKey,
        lqAmount,
        npmAmount,
        signerOrProvider
      );

      await txToast.push(tx, {
        pending: "Adding Liquidity",
        success: "Added Liquidity Successfully",
        failure: "Could not add liquidity",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setProviding(false);
    }
  };

  const hasLqTokenAllowance = isGreaterOrEqual(
    lqTokenAllowance || "0",
    convertToUnits(lqValue || "0")
  );
  const hasNPMTokenAllowance = isGreaterOrEqual(
    npmTokenAllowance || "0",
    convertToUnits(npmValue || "0")
  );

  const canProvideLiquidity =
    lqValue &&
    isValidNumber(lqValue) &&
    isGreaterOrEqual(lqTokenAllowance || "0", convertToUnits(lqValue || "0"));
  const isError =
    lqValue &&
    (!isValidNumber(lqValue) ||
      isGreater(convertToUnits(lqValue || "0"), lqTokenBalance || "0"));

  return {
    lqTokenBalance,
    npmBalance,
    hasLqTokenAllowance,
    hasNPMTokenAllowance,
    canProvideLiquidity,
    isError,
    lqApproving,
    npmApproving,
    providing,
    handleLqTokenApprove,
    handleNPMTokenApprove,
    handleProvide,
    podSymbol,
  };
};
