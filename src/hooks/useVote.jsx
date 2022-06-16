import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";
import {
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
} from "@/utils/bn";
import { useNetwork } from "@/src/context/Network";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useAppConstants } from "@/src/context/AppConstants";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useGovernanceAddress } from "@/src/hooks/contracts/useGovernanceAddress";
import { useERC20Allowance } from "@/src/hooks/useERC20Allowance";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { t } from "@lingui/macro";

export const useVote = ({ coverKey, value, incidentDate }) => {
  const [approving, setApproving] = useState(false);
  const [voting, setVoting] = useState(false);

  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();
  const { NPMTokenAddress } = useAppConstants();
  const tokenSymbol = useTokenSymbol(NPMTokenAddress);
  const txToast = useTxToast();
  const governanceAddress = useGovernanceAddress();
  const { invoke } = useInvokeMethod();
  const {
    allowance,
    approve,
    loading: loadingAllowance,
    refetch: updateAllowance,
  } = useERC20Allowance(NPMTokenAddress);
  const {
    balance,
    loading: loadingBalance,
    refetch: updateBalance,
  } = useERC20Balance(NPMTokenAddress);
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    updateAllowance(governanceAddress);
  }, [governanceAddress, updateAllowance]);

  const handleApprove = async () => {
    setApproving(true);
    const cleanup = () => {
      setApproving(false);
    };
    const handleError = (err) => {
      notifyError(err, t`approve ${tokenSymbol} tokens`);
    };

    const onTransactionResult = async (tx) => {
      try {
        await txToast.push(tx, {
          pending: t`Approving ${tokenSymbol} tokens`,
          success: t`Approved ${tokenSymbol} tokens Successfully`,
          failure: t`Could not approve ${tokenSymbol} tokens`,
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

    approve(governanceAddress, convertToUnits(value).toString(), {
      onTransactionResult,
      onRetryCancel,
      onError,
    });
  };

  const handleAttest = async (onTxSuccess) => {
    setVoting(true);
    const cleanup = () => {
      updateBalance();
      updateAllowance(governanceAddress);
      setVoting(false);
    };
    const handleError = (err) => {
      notifyError(err, t`attest`);
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.Governance.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(
          tx,
          {
            pending: t`Attesting`,
            success: t`Attested successfully`,
            failure: t`Could not attest`,
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

      const productKey = null;
      const args = [coverKey, productKey, incidentDate, convertToUnits(value).toString()];
      invoke({
        instance,
        methodName: "attest",
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

  const handleRefute = async () => {
    setVoting(true);

    const cleanup = () => {
      setVoting(false);
      updateBalance();
      updateAllowance(governanceAddress);
    };
    const handleError = (err) => {
      notifyError(err, t`refute`);
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.Governance.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(tx, {
          pending: t`Refuting`,
          success: t`Refuted successfully`,
          failure: t`Could not refute`,
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

      const productKey = null;
      const args = [coverKey, productKey, incidentDate, convertToUnits(value).toString()];
      invoke({
        instance,
        methodName: "refute",
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

  const canVote =
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(allowance, convertToUnits(value || "0"));
  const isError =
    value &&
    (!isValidNumber(value) || isGreater(convertToUnits(value || "0"), balance));

  return {
    tokenAddress: NPMTokenAddress,
    tokenSymbol,

    balance,
    approving,
    voting,

    loadingAllowance,
    loadingBalance,

    canVote,
    isError,

    handleApprove,
    handleAttest,
    handleRefute,
  };
};
