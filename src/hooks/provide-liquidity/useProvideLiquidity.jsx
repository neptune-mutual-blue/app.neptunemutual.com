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
import { useTxToast } from "@/src/hooks/useTxToast";

export const useProvideLiquidity = ({
  coverKey,
  liquidityTokenAddress,
  value,
}) => {
  const [receiveAmount, setReceiveAmount] = useState();
  const [balance, setBalance] = useState();
  const [allowance, setAllowance] = useState();
  const [approving, setApproving] = useState();
  const [providing, setProviding] = useState();

  const txToast = useTxToast();

  const { library, account, chainId } = useWeb3React();

  useEffect(() => {
    if (!chainId || !account) return;

    let ignore = false;
    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    const instance = registry.IERC20.getInstance(
      chainId,
      liquidityTokenAddress,
      signerOrProvider
    );

    if (!instance) {
      console.log("No instance found");
    }

    instance
      .balanceOf(account)
      .then((bal) => {
        if (ignore) return;
        setBalance(bal);
      })
      .catch((e) => {
        console.error(e);
        if (ignore) return;
      });

    return () => (ignore = true);
  }, [account, chainId, library, liquidityTokenAddress]);

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
  }, [account, chainId, library, liquidityTokenAddress, coverKey]);

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

      let { result: tx } = await liquidity.approve(
        chainId,
        coverKey,
        { amount: convertToUnits(value).toString() },
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

  const calculatePods = (val) => {
    if (typeof val === "string") {
      const willRecieve = parseFloat(0.99 * val).toFixed(2);
      setReceiveAmount(willRecieve);
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
    receiveAmount,
    approving,
    providing,
    handleApprove,
    handleProvide,
    calculatePods,
  };
};
