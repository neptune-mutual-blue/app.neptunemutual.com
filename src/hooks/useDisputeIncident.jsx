import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
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
import { useRouter } from "next/router";
// import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useGovernanceAddress } from "@/src/hooks/contracts/useGovernanceAddress";
import { useERC20Allowance } from "@/src/hooks/useERC20Allowance";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";
import { registry, utils } from "@neptunemutual/sdk";
import { getParsedKey } from "@/src/helpers/cover";

export const useDisputeIncident = ({ coverKey, value, incidentDate }) => {
  const router = useRouter();

  const [approving, setApproving] = useState(false);
  const [disputing, setDisputing] = useState(false);

  const { account, library } = useWeb3React();
  const { networkId } = useAppContext();
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
  // const { invoke } = useInvokeMethod();
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

  const handleDispute = async (info) => {
    setDisputing(true);

    if (!networkId || !account) {
      return;
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const payload = await utils.ipfs.write({ ...info, createdBy: account });

      if (payload === undefined) {
        throw new Error("Could not save cover to an IPFS network");
      }

      const hashBytes32 = payload[1];

      const instance = await registry.Governance.getInstance(
        networkId,
        signerOrProvider
      );

      const tx = await instance.dispute(
        coverKey,
        incidentDate,
        hashBytes32,
        convertToUnits(value).toString()
      );

      await txToast.push(tx, {
        pending: "Disputing",
        success: "Disputed successfully",
        failure: "Could not dispute",
      });

      router.replace(`/reporting/${getParsedKey(coverKey)}/${incidentDate}`);
    } catch (err) {
      notifyError(err, "dispute");
    } finally {
      setDisputing(false);
    }
  };

  const canDispute =
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
    disputing,

    canDispute,
    isError,

    handleApprove,
    handleDispute,
  };
};
