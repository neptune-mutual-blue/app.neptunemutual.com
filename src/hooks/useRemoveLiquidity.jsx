import { useWeb3React } from "@web3-react/core";
import { registry } from "@neptunemutual/sdk";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { convertToUnits } from "@/utils/bn";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useNetwork } from "@/src/context/Network";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useEffect, useState } from "react";
import { useERC20Allowance } from "@/src/hooks/useERC20Allowance";
import { useLiquidityFormsContext } from "@/common/LiquidityForms/LiquidityFormsContext";
import { t } from "@lingui/macro";

export const useRemoveLiquidity = ({
  coverKey,
  value,
  npmValue,
  refetchInfo,
}) => {
  const [approving, setApproving] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const { library, account } = useWeb3React();
  const { networkId } = useNetwork();
  const {
    updateMinStakeInfo,
    vaultTokenAddress,
    vaultTokenSymbol,
    podBalance,
    loadingPodBalance,
    updatePodBalance,
    // Both NPM and DAI should be updated after withdrawal is successful
    updateLqTokenBalance,
    updateStakingTokenBalance,
  } = useLiquidityFormsContext();
  const {
    allowance,
    approve,
    loading: loadingAllowance,
    refetch: updateAllowance,
  } = useERC20Allowance(vaultTokenAddress);

  const txToast = useTxToast();
  const { notifyError } = useErrorNotifier();
  const { invoke } = useInvokeMethod();

  useEffect(() => {
    updateAllowance(vaultTokenAddress);
  }, [vaultTokenAddress, updateAllowance]);

  const handleApprove = async () => {
    setApproving(true);
    const cleanup = () => {
      setApproving(false);
    };
    const handleError = (err) => {
      notifyError(err, t`approve ${vaultTokenSymbol} tokens`);
    };

    const onTransactionResult = async (tx) => {
      try {
        await txToast.push(tx, {
          pending: t`Approving ${vaultTokenSymbol} tokens`,
          success: t`Approved ${vaultTokenSymbol} tokens Successfully`,
          failure: t`Could not approve ${vaultTokenSymbol} tokens`,
        });
        cleanup();
      } catch (err) {
        handleError(err);
        cleanup();
      }
    };

    const onRetryCancel = () => {
      cleanup();
    };

    const onError = (err) => {
      handleError(err);
      cleanup();
    };

    approve(vaultTokenAddress, convertToUnits(value).toString(), {
      onTransactionResult,
      onRetryCancel,
      onError,
    });
  };

  const handleWithdraw = async (onTxSuccess, exit = false) => {
    if (!networkId || !account) return;

    setWithdrawing(true);
    const cleanup = () => {
      refetchInfo();
      setWithdrawing(false);

      updatePodBalance();
      updateAllowance(vaultTokenAddress);
      updateMinStakeInfo();

      // Both NPM and DAI should be updated after withdrawal is successful
      // Will be reflected in provide liquidity form
      updateLqTokenBalance();
      updateStakingTokenBalance();
    };

    const handleError = (err) => {
      notifyError(err, t`remove liquidity`);
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      const instance = await registry.Vault.getInstance(
        networkId,
        coverKey,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(
          tx,
          {
            pending: t`Removing Liquidity`,
            success: t`Removed Liquidity Successfully`,
            failure: t`Could not remove liquidity`,
          },
          {
            onTxSuccess: onTxSuccess,
          }
        );
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
        convertToUnits(value).toString(),
        convertToUnits(npmValue).toString(),
        exit,
      ];
      invoke({
        instance,
        methodName: "removeLiquidity",
        onTransactionResult,
        onRetryCancel,
        onError,
        args,
      });
    } catch (err) {
      handleError(err);
      cleanup();
    }
  };

  return {
    podBalance,
    allowance,
    vaultTokenAddress,
    vaultTokenSymbol,

    loadingAllowance,
    loadingPodBalance,

    approving,
    withdrawing,

    handleApprove,
    handleWithdraw,
  };
};
