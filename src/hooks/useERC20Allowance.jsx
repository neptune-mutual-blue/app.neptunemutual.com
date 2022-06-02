import { useState, useCallback, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { registry } from "@neptunemutual/sdk";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useApprovalAmount } from "@/src/hooks/useApprovalAmount";
import { useAuthValidation } from "@/src/hooks/useAuthValidation";
import { t } from "@lingui/macro";

export const useERC20Allowance = (tokenAddress) => {
  const [allowance, setAllowance] = useState("0");
  const [loading, setLoading] = useState(false);
  const { networkId } = useNetwork();
  const { library, account } = useWeb3React();
  const { notifyError } = useErrorNotifier();
  const { invoke } = useInvokeMethod();
  const { getApprovalAmount } = useApprovalAmount();
  const { requiresAuth } = useAuthValidation();

  const fetchAllowance = useCallback(
    async (
      spender,
      { onTransactionResult, onRetryCancel, onError, cleanup }
    ) => {
      if (!networkId || !account || !tokenAddress) {
        cleanup();
        return;
      }

      if (!spender) {
        // Cleanup explicitly since the below useEffect cannot access spender
        cleanup();
        return;
      }

      try {
        const signerOrProvider = getProviderOrSigner(
          library,
          account,
          networkId
        );

        const tokenInstance = registry.IERC20.getInstance(
          tokenAddress,
          signerOrProvider
        );

        if (!tokenInstance) {
          console.log(
            "Could not get an instance of the ERC20 from the SDK",
            tokenAddress
          );
          return;
        }

        const args = [account, spender];
        invoke({
          instance: tokenInstance,
          methodName: "allowance",
          args,
          retry: false,
          onTransactionResult,
          onRetryCancel,
          onError,
        });
      } catch (err) {
        onError(err);
      }
    },
    [account, invoke, library, networkId, tokenAddress]
  );

  // Resets loading and other states which are modified in the above hook
  // "IF" condition should match the above effect
  // Should appear after the effect which contains the async function (which sets loading state)
  useEffect(() => {
    if (!networkId || !account || !tokenAddress) {
      if (allowance !== "0") {
        setAllowance("0");
      }
      if (loading !== false) {
        setLoading(false);
      }
    }
  }, [account, allowance, loading, networkId, tokenAddress]);

  const refetch = useCallback(
    async (spender) => {
      setLoading(true);

      const cleanup = () => {
        setLoading(false);
      };

      const handleError = (err) => {
        notifyError(err, t`get allowance`);
      };

      const onTransactionResult = (_allowance) => {
        if (_allowance) {
          setAllowance(_allowance.toString());
        }
        cleanup();
      };

      const onRetryCancel = () => {
        cleanup();
      };

      const onError = (err) => {
        handleError(err);
        cleanup();
      };

      fetchAllowance(spender, {
        onTransactionResult,
        onRetryCancel,
        onError,
        cleanup,
      });
    },
    [fetchAllowance, notifyError]
  );

  /**
   *
   * @param {string} spender
   * @param {string} amount
   */
  const approve = async (
    spender,
    amount,
    { onTransactionResult, onRetryCancel, onError }
  ) => {
    if (!networkId || !account || !tokenAddress || !spender) {
      requiresAuth();
      throw new Error("Could not approve");
    }

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    const tokenInstance = registry.IERC20.getInstance(
      tokenAddress,
      signerOrProvider
    );

    if (!tokenInstance) {
      console.log(
        "Could not get an instance of the ERC20 from the SDK",
        tokenAddress
      );
    }

    const args = [spender, getApprovalAmount(amount)];
    invoke({
      instance: tokenInstance,
      methodName: "approve",
      args,
      onError: (...args) => {
        console.log("test onError", ...args);
        onError(...args);
      },
      onRetryCancel: (...args) => {
        console.log("test onRetryCancel", ...args);
        onRetryCancel(...args);
      },
      onTransactionResult: (tx) => {
        console.log("test onTransactionResult", ...args);
        tx?.wait().then(() => {
          refetch(spender);
        });

        onTransactionResult(tx);
      },
    });
  };

  return { allowance, loading, approve, refetch };
};
