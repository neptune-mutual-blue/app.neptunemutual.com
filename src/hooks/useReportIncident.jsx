import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { governance } from "@neptunemutual/sdk";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import {
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
} from "@/utils/bn";
import { useNetwork } from "@/src/context/Network";
import { useAppConstants } from "@/src/context/AppConstants";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useRouter } from "next/router";
import { useGovernanceAddress } from "@/src/hooks/contracts/useGovernanceAddress";
import { useERC20Allowance } from "@/src/hooks/useERC20Allowance";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";
import { t } from "@lingui/macro";
import { txToast } from "@/src/store/toast";

export const useReportIncident = ({ coverKey, value }) => {
  const router = useRouter();

  const [approving, setApproving] = useState(false);
  const [reporting, setReporting] = useState(false);

  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();
  const governanceContractAddress = useGovernanceAddress();
  const { NPMTokenAddress } = useAppConstants();
  const tokenSymbol = useTokenSymbol(NPMTokenAddress);
  const {
    allowance,
    loading: loadingAllowance,
    refetch: updateAllowance,
    approve,
  } = useERC20Allowance(NPMTokenAddress);
  const {
    balance,
    loading: loadingBalance,
    refetch: updateBalance,
  } = useERC20Balance(NPMTokenAddress);

  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    updateAllowance(governanceContractAddress);
  }, [governanceContractAddress, updateAllowance]);

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
        await txToast({
          tx,
          titles: {
            pending: t`Approving ${tokenSymbol} tokens`,
            success: t`Approved ${tokenSymbol} tokens Successfully`,
            failure: t`Could not approve ${tokenSymbol} tokens`,
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

    approve(governanceContractAddress, convertToUnits(value).toString(), {
      onTransactionResult,
      onRetryCancel,
      onError,
    });
  };

  const handleReport = async (payload) => {
    setReporting(true);

    const cleanup = () => {
      setReporting(false);
      updateAllowance(governanceContractAddress);
      updateBalance();
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const wrappedResult = await governance.report(
        networkId,
        coverKey,
        payload,
        signerOrProvider
      );

      const tx = wrappedResult.result.tx;

      await txToast({
        tx,
        titles: {
          pending: t`Reporting incident`,
          success: t`Reported incident successfully`,
          failure: t`Could not report incident`,
        },
        options: { onTxSuccess: () => router.replace(`/reporting/active`) },
        networkId,
      });
    } catch (err) {
      notifyError(err, t`report incident`);
    } finally {
      cleanup();
    }
  };

  const canReport =
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
    loadingBalance,

    approving,
    loadingAllowance,

    reporting,

    canReport,
    isError,

    handleApprove,
    handleReport,
  };
};
