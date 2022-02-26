import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { registry } from "@neptunemutual/sdk";

import {
  convertToUnits,
  isValidNumber,
  isGreaterOrEqual,
  isGreater,
} from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useAppContext } from "@/src/context/AppWrapper";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useAppConstants } from "@/src/context/AppConstants";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";
import { useERC20Allowance } from "@/src/hooks/useERC20Allowance";
import { usePolicyAddress } from "@/src/hooks/contracts/usePolicyAddress";

export const usePurchasePolicy = ({
  coverKey,
  value,
  feeAmount,
  feeError,
  coverMonth,
}) => {
  const { library, account } = useWeb3React();
  const { networkId } = useAppContext();

  const [approving, setApproving] = useState();
  const [purchasing, setPurchasing] = useState();
  const [error, setError] = useState("");

  const txToast = useTxToast();
  const policyContractAddress = usePolicyAddress();
  const { liquidityTokenAddress } = useAppConstants();
  const { balance, refetch: updateBalance } = useERC20Balance(
    liquidityTokenAddress
  );
  const {
    allowance,
    approve,
    refetch: updateAllowance,
  } = useERC20Allowance(liquidityTokenAddress);
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    updateAllowance(policyContractAddress);
  }, [policyContractAddress, updateAllowance]);

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

  const handleApprove = async () => {
    try {
      setApproving(true);

      const tx = await approve(policyContractAddress, feeAmount);

      await txToast.push(tx, {
        pending: "Approving DAI",
        success: "Approved DAI Successfully",
        failure: "Could not approve DAI",
      });

      updateAllowance(policyContractAddress);
    } catch (err) {
      notifyError(err, "approve DAI");
    } finally {
      setApproving(false);
    }
  };

  const handlePurchase = async () => {
    try {
      setPurchasing(true);

      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const policyContract = await registry.PolicyContract.getInstance(
        networkId,
        signerOrProvider
      );
      const catcher = notifyError;

      const args = [
        coverKey,
        parseInt(coverMonth, 10),
        convertToUnits(value).toString(), // <-- Amount to Cover (In DAI)
      ];
      const tx = await invoke(
        policyContract,
        "purchaseCover",
        {},
        catcher,
        args
      );

      await txToast.push(tx, {
        pending: "Purchasing Policy",
        success: "Purchased Policy Successfully",
        failure: "Could not purchase policy",
      });

      updateBalance();
      updateAllowance(policyContractAddress);
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
