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
import { useAppContext } from "@/src/context/AppWrapper";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useAppConstants } from "@/src/context/AppConstants";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useGovernanceAddress } from "@/src/hooks/contracts/useGovernanceAddress";
import { useERC20Allowance } from "@/src/hooks/useERC20Allowance";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useRouter } from "next/router";

export const useVote = ({ coverKey, value, incidentDate }) => {
  const [approving, setApproving] = useState(false);
  const [voting, setVoting] = useState(false);

  const { account, library } = useWeb3React();
  const { networkId } = useAppContext();
  const { NPMTokenAddress } = useAppConstants();
  const tokenSymbol = useTokenSymbol(NPMTokenAddress);
  const txToast = useTxToast();
  const governanceAddress = useGovernanceAddress();
  const { invoke } = useInvokeMethod();
  const {
    allowance,
    approve,
    refetch: updateAllowance,
  } = useERC20Allowance(NPMTokenAddress);
  const { balance, refetch: updateBalance } = useERC20Balance(NPMTokenAddress);
  const { notifyError } = useErrorNotifier();

  const router = useRouter();

  useEffect(() => {
    updateAllowance(governanceAddress);
  }, [governanceAddress, updateAllowance]);

  const handleApprove = async () => {
    setApproving(true);
    try {
      const tx = await approve(
        governanceAddress,
        convertToUnits(value).toString()
      );

      await txToast.push(tx, {
        pending: `Approving ${tokenSymbol} tokens`,
        success: `Approved ${tokenSymbol} tokens Successfully`,
        failure: `Could not approve ${tokenSymbol} tokens`,
      });

      updateAllowance(governanceAddress);
    } catch (err) {
      notifyError(err, `approve ${tokenSymbol} tokens`);
    } finally {
      setApproving(false);
    }
  };

  const handleAttest = async () => {
    setVoting(true);

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.Governance.getInstance(
        networkId,
        signerOrProvider
      );

      const args = [coverKey, incidentDate, convertToUnits(value).toString()];
      const tx = await invoke(instance, "attest", {}, notifyError, args);

      await txToast.push(tx, {
        pending: "Attesting",
        success: "Attested successfully",
        failure: "Could not attest",
      });
      updateBalance();
      updateAllowance();
    } catch (err) {
      notifyError(err, "attest");
    } finally {
      setVoting(false);
    }
  };

  const handleRefute = async () => {
    setVoting(true);

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.Governance.getInstance(
        networkId,
        signerOrProvider
      );

      const args = [coverKey, incidentDate, convertToUnits(value).toString()];
      const tx = await invoke(instance, "refute", {}, notifyError, args);

      await txToast.push(tx, {
        pending: "Refuting",
        success: "Refuted successfully",
        failure: "Could not refute",
      });
    } catch (err) {
      // console.error(err);
      notifyError(err, "refute");
    } finally {
      setVoting(false);
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

    canVote,
    isError,

    handleApprove,
    handleAttest,
    handleRefute,
  };
};
