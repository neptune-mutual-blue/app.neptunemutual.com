import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { policy } from "@neptunemutual/sdk";

import {
  convertToUnits,
  isValidNumber,
  isGreaterOrEqual,
  isGreater,
} from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useLiquidityBalance } from "@/src/hooks/useLiquidityBalance";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useApprovalAmount } from "@/src/hooks/useApprovalAmount";

export const usePurchasePolicy = ({
  coverKey,
  value,
  feeAmount,
  feeError,
  coverMonth,
}) => {
  const { library, account, chainId } = useWeb3React();

  const [allowance, setAllowance] = useState("0");
  const [approving, setApproving] = useState();
  const [purchasing, setPurchasing] = useState();
  const [error, setError] = useState("");
  const { getApprovalAmount } = useApprovalAmount();

  const txToast = useTxToast();
  const { balance } = useLiquidityBalance();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    let ignore = false;
    if (!chainId || !account) return;

    async function fetchAllowance() {
      const signerOrProvider = getProviderOrSigner(library, account, chainId);
      try {
        const { result } = await policy.getAllowance(
          chainId,
          account,
          signerOrProvider
        );
        if (ignore) return;
        setAllowance(result);
      } catch (err) {
        console.error(err);
      }
    }

    fetchAllowance();

    return () => (ignore = true);
  }, [account, chainId, library, coverKey]);

  useEffect(() => {
    if (!value && error) {
      setError("");
      return;
    }

    if (!value) {
      return;
    }

    if (!account) {
      setError("Please connect your wallet");
      return;
    }

    if (!isValidNumber(value)) {
      setError("Invalid amount to cover");
      return;
    }

    if (feeError) {
      setError("Could not get fees");
      return;
    }

    if (isGreater(feeAmount || "0", balance || "0")) {
      setError("Insufficient Balance");
      return;
    }

    if (error) {
      setError("");
      return;
    }
  }, [account, balance, error, feeAmount, feeError, value]);

  const checkAllowance = async () => {
    if (!account || !chainId) {
      return;
    }
    try {
      const signerOrProvider = getProviderOrSigner(library, account, chainId);
      const { result: _allowance } = await policy.getAllowance(
        chainId,
        account,
        signerOrProvider
      );

      setAllowance(_allowance);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async () => {
    try {
      setApproving(true);
      const signerOrProvider = getProviderOrSigner(library, account, chainId);

      const { result: tx } = await policy.approve(
        chainId,
        {
          amount: getApprovalAmount(feeAmount || "0"),
        },
        signerOrProvider
      );

      await txToast.push(tx, {
        pending: "Approving DAI",
        success: "Approved DAI Successfully",
        failure: "Could not approve DAI",
      });

      checkAllowance();
    } catch (err) {
      notifyError(err, "approve DAI");
    } finally {
      setApproving(false);
    }
  };

  const handlePurchase = async () => {
    try {
      setPurchasing(true);

      const signerOrProvider = getProviderOrSigner(library, account, chainId);

      const { result: tx } = await policy.purchaseCover(
        chainId,
        coverKey,
        {
          duration: parseInt(coverMonth, 10),
          amount: convertToUnits(value).toString(), // <-- Amount to Cover (In DAI)
        },
        signerOrProvider
      );

      await txToast.push(tx, {
        pending: "Purchasing Policy",
        success: "Purchased Policy Successfully",
        failure: "Could not purchase policy",
      });

      setPurchasing(false);
    } catch (err) {
      notifyError(err, "purchase policy");
      setPurchasing(false);
    }
  };

  const canPurchase =
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(allowance || "0", feeAmount || "0");

  return {
    balance,
    allowance,
    approving,
    purchasing,
    canPurchase,
    error,
    handleApprove,
    handlePurchase,
  };
};
