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
import { useTxToast } from "@/src/hooks/useTxToast";
import { useAppConstants } from "@/src/context/AppConstants";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useRouter } from "next/router";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useGovernanceAddress } from "@/src/hooks/contracts/useGovernanceAddress";
import { useERC20Allowance } from "@/src/hooks/useERC20Allowance";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";

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
    refetch: updateAllowance,
    approve,
  } = useERC20Allowance(NPMTokenAddress);
  const { balance } = useERC20Balance(NPMTokenAddress);

  const txToast = useTxToast();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    updateAllowance(governanceContractAddress);
  }, [governanceContractAddress, updateAllowance]);

  const handleApprove = async () => {
    try {
      setApproving(true);
      const tx = await approve(
        governanceContractAddress,
        convertToUnits(value).toString()
      );

      await txToast.push(tx, {
        pending: `Approving ${tokenSymbol} tokens`,
        success: `Approved ${tokenSymbol} tokens Successfully`,
        failure: `Could not approve ${tokenSymbol} tokens`,
      });

      setApproving(false);
      updateAllowance(governanceContractAddress);
    } catch (error) {
      notifyError(error, `approve ${tokenSymbol} tokens`);
      setApproving(false);
    }
  };

  const handleReport = async (payload) => {
    setReporting(true);

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const wrappedResult = await governance.report(
        networkId,
        coverKey,
        payload,
        signerOrProvider
      );

      const tx = wrappedResult.result.tx;

      await txToast.push(tx, {
        pending: "Reporting incident",
        success: "Reported incident successfully",
        failure: "Could not report incident",
      });

      router.replace(`/reporting/active`);
    } catch (err) {
      // console.error(err);
      notifyError(err, "report incident");
    } finally {
      setReporting(false);
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
    approving,
    reporting,

    canReport,
    isError,

    handleApprove,
    handleReport,
  };
};
