import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";
import {
  convertFromUnits,
  convertToUnits,
  isEqualTo,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
  sort,
} from "@/utils/bn";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useERC20Allowance } from "@/src/hooks/useERC20Allowance";
import { useStakingPoolsAddress } from "@/src/hooks/contracts/useStakingPoolsAddress";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useNetwork } from "@/src/context/Network";
import { t } from "@lingui/macro";
import { useNumberFormat } from "@/src/hooks/useNumberFormat";

export const useStakingPoolDeposit = ({
  value,
  poolKey,
  tokenAddress,
  tokenSymbol,
  maximumStake,
  refetchInfo,
}) => {
  const [error, setError] = useState("");
  const [approving, setApproving] = useState(false);
  const [depositing, setDepositing] = useState(false);

  const { networkId } = useNetwork();
  const { account, library } = useWeb3React();
  const poolContractAddress = useStakingPoolsAddress();
  const {
    allowance,
    approve,
    refetch: updateAllowance,
    loading: loadingAllowance,
  } = useERC20Allowance(tokenAddress);
  const {
    balance,
    refetch: updateBalance,
    loading: loadingBalance,
  } = useERC20Balance(tokenAddress);

  const txToast = useTxToast();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();
  const { formatCurrency } = useNumberFormat();

  // Minimum of info.maximumStake, balance
  const maxStakableAmount = sort([maximumStake, balance])[0];

  useEffect(() => {
    updateAllowance(poolContractAddress);
  }, [poolContractAddress, updateAllowance]);

  const handleApprove = async () => {
    setApproving(true);

    const cleanup = () => {
      setApproving(false);
    };
    const handleError = (err) => {
      notifyError(err, t`approve ${tokenSymbol}`);
    };

    const onTransactionResult = async (tx) => {
      try {
        await txToast.push(tx, {
          pending: t`Approving ${tokenSymbol}`,
          success: t`Approved ${tokenSymbol} Successfully`,
          failure: t`Could not approve ${tokenSymbol}`,
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

    approve(poolContractAddress, convertToUnits(value).toString(), {
      onTransactionResult,
      onRetryCancel,
      onError,
    });
  };

  const handleDeposit = async (onDepositSuccess) => {
    if (!account || !networkId) {
      return;
    }

    setDepositing(true);

    const cleanup = () => {
      updateBalance();
      updateAllowance(poolContractAddress);
      refetchInfo();
      setDepositing(false);
    };

    const handleError = (err) => {
      notifyError(err, t`stake ${tokenSymbol}`);
    };

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    try {
      const instance = await registry.StakingPools.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(
          tx,
          {
            pending: t`Staking ${tokenSymbol}`,
            success: t`Staked ${tokenSymbol} successfully`,
            failure: t`Could not stake ${tokenSymbol}`,
          },
          {
            onTxSuccess: onDepositSuccess,
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

      const args = [poolKey, convertToUnits(value).toString()];
      invoke({
        instance,
        methodName: "deposit",
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

  useEffect(() => {
    if (!value && error) {
      setError("");
      return;
    }

    if (!value) {
      return;
    }

    if (!isValidNumber(value)) {
      setError(t`Invalid amount to stake`);
      return;
    }

    if (!account) {
      setError(t`Please connect your wallet`);
      return;
    }

    if (isEqualTo(value, "0")) {
      setError(t`Please specify an amount`);
      return;
    }

    if (isGreater(convertToUnits(value).toString(), balance)) {
      setError(t`Insufficient Balance`);
      return;
    }

    if (isGreater(convertToUnits(value).toString(), maxStakableAmount)) {
      setError(
        t`Cannot stake more than ${
          formatCurrency(
            convertFromUnits(maxStakableAmount).toString(),
            "",
            true
          ).short
        }`
      );
      return;
    }

    if (error) {
      setError("");
      return;
    }
  }, [account, balance, error, maxStakableAmount, value]);

  const canDeposit =
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(allowance, convertToUnits(value || "0"));

  const isError = value && (!isValidNumber(value) || error);

  return {
    balance,
    loadingBalance,

    maxStakableAmount,

    isError,
    errorMsg: error,

    approving,
    loadingAllowance,

    depositing,

    canDeposit,

    handleApprove,
    handleDeposit,
  };
};
