import { useState, useEffect } from "react";
import { registry, utils } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";

import {
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
} from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useNetwork } from "@/src/context/Network";
import { useERC20Allowance } from "@/src/hooks/useERC20Allowance";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useLiquidityFormsContext } from "@/common/LiquidityForms/LiquidityFormsContext";
import { useAppConstants } from "@/src/context/AppConstants";
import { t } from "@lingui/macro";
import { txToast } from "@/src/store/toast";

export const useProvideLiquidity = ({ coverKey, lqValue, npmValue }) => {
  const [lqApproving, setLqApproving] = useState();
  const [npmApproving, setNPMApproving] = useState();
  const [providing, setProviding] = useState();

  const { networkId } = useNetwork();
  const { library, account } = useWeb3React();
  const {
    vaultTokenAddress,
    vaultTokenSymbol,
    lqTokenBalance,
    lqBalanceLoading,
    updateLqTokenBalance,
    stakingTokenBalance,
    stakingTokenBalanceLoading,
    updateStakingTokenBalance,
    updateMinStakeInfo,
    updatePodBalance,
  } = useLiquidityFormsContext();
  const { liquidityTokenAddress, NPMTokenAddress } = useAppConstants();
  const {
    allowance: lqTokenAllowance,
    approve: lqTokenApprove,
    loading: lqAllowanceLoading,
    refetch: updateLqAllowance,
  } = useERC20Allowance(liquidityTokenAddress);
  const {
    allowance: stakeTokenAllowance,
    approve: stakeTokenApprove,
    loading: stakeAllowanceLoading,
    refetch: updateStakeAllowance,
  } = useERC20Allowance(NPMTokenAddress);

  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    updateLqAllowance(vaultTokenAddress);
  }, [updateLqAllowance, vaultTokenAddress]);

  useEffect(() => {
    updateStakeAllowance(vaultTokenAddress);
  }, [updateStakeAllowance, vaultTokenAddress]);

  const handleLqTokenApprove = async () => {
    setLqApproving(true);

    const cleanup = () => {
      setLqApproving(false);
    };

    const handleError = (err) => {
      notifyError(err, t`approve DAI`);
    };

    const onTransactionResult = async (tx) => {
      try {
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

    lqTokenApprove(vaultTokenAddress, convertToUnits(lqValue).toString(), {
      onTransactionResult,
      onRetryCancel,
      onError,
    });
  };

  const handleNPMTokenApprove = async () => {
    setNPMApproving(true);

    const cleanup = () => {
      setNPMApproving(false);
    };
    const handleError = (err) => {
      notifyError(err, t`approve NPM`);
    };

    const onTransactionResult = async (tx) => {
      try {
        await txToast({
          tx,
          titles: {
            pending: t`Approving NPM`,
            success: t`Approved NPM Successfully`,
            failure: t`Could not approve NPM`,
          },
          networkId,
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

    stakeTokenApprove(vaultTokenAddress, convertToUnits(npmValue).toString(), {
      onTransactionResult,
      onRetryCancel,
      onError,
    });
  };

  const handleProvide = async (onTxSuccess) => {
    setProviding(true);

    const cleanup = () => {
      setProviding(false);
      updateMinStakeInfo();
      updateLqTokenBalance();
      updateStakingTokenBalance();
      updatePodBalance();
      updateLqAllowance(vaultTokenAddress);
      updateStakeAllowance(vaultTokenAddress);
    };
    const handleError = (err) => {
      notifyError(err, t`add liquidity`);
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      const lqAmount = convertToUnits(lqValue).toString();
      const npmAmount = convertToUnits(npmValue).toString();

      const vault = await registry.Vault.getInstance(
        networkId,
        coverKey,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast({
          tx,
          titles: {
            pending: t`Adding Liquidity`,
            success: t`Added Liquidity Successfully`,
            failure: t`Could not add liquidity`,
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

      const args = [coverKey, lqAmount, npmAmount, utils.keyUtil.toBytes32("")];
      invoke({
        instance: vault,
        methodName: "addLiquidity",
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

  const hasLqTokenAllowance = isGreaterOrEqual(
    lqTokenAllowance || "0",
    convertToUnits(lqValue || "0")
  );
  const hasNPMTokenAllowance = isGreaterOrEqual(
    stakeTokenAllowance || "0",
    convertToUnits(npmValue || "0")
  );

  const canProvideLiquidity =
    lqValue &&
    isValidNumber(lqValue) &&
    hasLqTokenAllowance &&
    hasNPMTokenAllowance;
  const isError =
    lqValue &&
    (!isValidNumber(lqValue) ||
      isGreater(convertToUnits(lqValue || "0"), lqTokenBalance || "0"));

  return {
    npmApproving,
    npmBalance: stakingTokenBalance,
    npmBalanceLoading: stakingTokenBalanceLoading,
    hasNPMTokenAllowance,
    npmAllowanceLoading: stakeAllowanceLoading,

    hasLqTokenAllowance,
    lqApproving,
    lqTokenBalance,
    lqBalanceLoading,
    lqAllowanceLoading,

    canProvideLiquidity,
    isError,
    providing,
    podSymbol: vaultTokenSymbol,

    handleLqTokenApprove,
    handleNPMTokenApprove,
    handleProvide,
  };
};
