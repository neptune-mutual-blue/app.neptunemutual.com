import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { registry, utils } from "@neptunemutual/sdk";

import {
  convertToUnits,
  isValidNumber,
  isGreaterOrEqual,
  isGreater,
} from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useNetwork } from "@/src/context/Network";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useAppConstants } from "@/src/context/AppConstants";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";
import { useERC20Allowance } from "@/src/hooks/useERC20Allowance";
import { usePolicyAddress } from "@/src/hooks/contracts/usePolicyAddress";
import { formatCurrency } from "@/utils/formatter/currency";
import { t } from "@lingui/macro";
import { useRouter } from "next/router";
import { txToast } from "@/src/store/toast";

export const usePurchasePolicy = ({
  coverKey,
  value,
  feeAmount,
  coverMonth,
  availableLiquidity,
}) => {
  const { library, account } = useWeb3React();
  const { networkId } = useNetwork();

  const [approving, setApproving] = useState();
  const [purchasing, setPurchasing] = useState();
  const [error, setError] = useState("");

  const policyContractAddress = usePolicyAddress();
  const { liquidityTokenAddress } = useAppConstants();
  const {
    balance,
    refetch: updateBalance,
    loading: updatingBalance,
  } = useERC20Balance(liquidityTokenAddress);
  const {
    allowance,
    approve,
    refetch: updateAllowance,
    loading: updatingAllowance,
  } = useERC20Allowance(liquidityTokenAddress);
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();
  const router = useRouter();

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
      setError(t`Please connect your wallet`);
      return;
    }

    if (!isValidNumber(value)) {
      setError(t`Invalid amount to cover`);
      return;
    }

    if (isGreater(feeAmount || "0", balance || "0")) {
      setError(t`Insufficient Balance`);
      return;
    }

    if (isGreater(value || 0, availableLiquidity || 0)) {
      setError(
        t`Maximum protection available is ${
          formatCurrency(availableLiquidity, router.locale).short
        }`
      );
      return;
    } else {
    }

    if (error) {
      setError("");
      return;
    }
  }, [
    account,
    availableLiquidity,
    balance,
    error,
    feeAmount,
    router.locale,
    value,
  ]);

  const handleApprove = async () => {
    setApproving(true);

    const cleanup = () => {
      setApproving(false);
    };

    const handleError = (err) => {
      notifyError(err, t`approve DAI`);
    };

    try {
      const onTransactionResult = async (tx) => {
        await txToast({
          tx,
          titles: {
            pending: t`Approving DAI`,
            success: t`Approved DAI Successfully`,
            failure: t`Could not approve DAI`,
          },
          networkId,
        });
        cleanup();
      };

      const onRetryCancel = () => {
        cleanup();
      };

      const onError = (err) => {
        handleError(err);
        cleanup();
      };

      approve(policyContractAddress, feeAmount, {
        onTransactionResult,
        onRetryCancel,
        onError,
      });
    } catch (err) {
      handleError(err);
      cleanup();
    }
  };

  const handlePurchase = async (onTxSuccess) => {
    setPurchasing(true);

    const cleanup = () => {
      setPurchasing(false);
      updateAllowance(policyContractAddress);
      updateBalance();
    };

    const handleError = (err) => {
      notifyError(err, t`purchase policy`);
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const policyContract = await registry.PolicyContract.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast({
          tx,
          titles: {
            pending: t`Purchasing Policy`,
            success: t`Purchased Policy Successfully`,
            failure: t`Could not purchase policy`,
          },
          options: { onTxSuccess },
          networkId,
        });

        cleanup();
      };

      const onRetryCancel = () => {
        cleanup();
      };

      const onError = (err) => {
        handleError(err);
        cleanup();
      };

      const args = [
        coverKey,
        parseInt(coverMonth, 10),
        convertToUnits(value).toString(), // <-- Amount to Cover (In DAI)
        utils.keyUtil.toBytes32(""),
      ];
      invoke({
        instance: policyContract,
        methodName: "purchaseCover",
        args,
        onTransactionResult,
        onRetryCancel,
        onError,
      });
    } catch (err) {
      handleError(err);
      cleanup();
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
    updatingAllowance,
    purchasing,
    canPurchase,
    error,
    handleApprove,
    handlePurchase,
    updatingBalance,
  };
};
