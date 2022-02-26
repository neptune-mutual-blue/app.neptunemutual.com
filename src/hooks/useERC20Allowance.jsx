import { useState, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { registry } from "@neptunemutual/sdk";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useApprovalAmount } from "@/src/hooks/useApprovalAmount";
import { useAuthValidation } from "@/src/hooks/useAuthValidation";

export const useERC20Allowance = (tokenAddress) => {
  const [allowance, setAllowance] = useState("0");
  const { networkId } = useAppContext();
  const { library, account } = useWeb3React();
  const { notifyError } = useErrorNotifier();
  const { invoke } = useInvokeMethod();
  const { getApprovalAmount } = useApprovalAmount();
  const { requiresAuth } = useAuthValidation();

  const fetchAllowance = useCallback(
    async (spender) => {
      if (!networkId || !account) return "0";
      if (!tokenAddress || !spender) return "0";

      try {
        const signerOrProvider = getProviderOrSigner(
          library,
          account,
          networkId
        );

        const tokenInstance = registry.IERC20.getInstance(
          networkId,
          tokenAddress,
          signerOrProvider
        );

        if (!tokenInstance) {
          console.log(
            "Could not get an instance of the ERC20 from the SDK",
            tokenAddress
          );
        }

        const args = [account, spender];
        const _allowance = await invoke(
          tokenInstance,
          "allowance",
          {},
          notifyError,
          args
        );

        return _allowance;
      } catch (err) {
        notifyError(err, "get allowance");
      }

      return "0";
    },
    [account, invoke, library, networkId, notifyError, tokenAddress]
  );

  const refetch = useCallback(
    async (spender) => {
      const _allowance = await fetchAllowance(spender);
      setAllowance(_allowance.toString());
    },
    [fetchAllowance]
  );

  /**
   *
   * @param {string} spender
   * @param {string} amount
   */
  const approve = async (spender, amount) => {
    if (!networkId || !account || !tokenAddress || !spender) {
      requiresAuth();
      throw new Error("Could not approve");
    }

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    const tokenInstance = registry.IERC20.getInstance(
      networkId,
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
    const tx = await invoke(tokenInstance, "approve", {}, notifyError, args);

    return tx;
  };

  return { allowance, approve, refetch };
};
