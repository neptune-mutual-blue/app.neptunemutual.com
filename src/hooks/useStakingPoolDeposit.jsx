import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";
import {
  convertToUnits,
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

export const useStakingPoolDeposit = ({
  value,
  poolKey,
  tokenAddress,
  tokenSymbol,
  maximumStake,
  refetchInfo,
}) => {
  const [errorMsg, setErrorMsg] = useState("");
  const [approving, setApproving] = useState(false);
  const [depositing, setDepositing] = useState(false);

  const { chainId, account, library } = useWeb3React();
  const poolContractAddress = useStakingPoolsAddress();
  const {
    allowance,
    approve,
    refetch: updateAllowance,
  } = useERC20Allowance(tokenAddress);
  const { balance, refetch: updateBalance } = useERC20Balance(tokenAddress);

  const txToast = useTxToast();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  // Minimum of info.maximumStake, balance
  const maxStakableAmount = sort([maximumStake, balance])[0];

  useEffect(() => {
    updateAllowance(poolContractAddress);
  }, [poolContractAddress, updateAllowance]);

  const handleApprove = async () => {
    try {
      setApproving(true);

      const tx = await approve(
        poolContractAddress,
        convertToUnits(value).toString()
      );

      await txToast.push(tx, {
        pending: `Approving ${tokenSymbol}`,
        success: `Approved ${tokenSymbol} Successfully`,
        failure: `Could not approve ${tokenSymbol}`,
      });

      setApproving(false);
      updateAllowance(poolContractAddress);
    } catch (error) {
      notifyError(error, `approve ${tokenSymbol}`);
      setApproving(false);
    }
  };

  const handleDeposit = async () => {
    if (!account || !chainId) {
      return;
    }

    setDepositing(true);
    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    try {
      const instance = await registry.StakingPools.getInstance(
        chainId,
        signerOrProvider
      );

      const args = [poolKey, convertToUnits(value).toString()];
      const tx = await invoke(instance, "deposit", {}, notifyError, args);

      const txnStatus = await txToast.push(tx, {
        pending: `Staking ${tokenSymbol}`,
        success: `Staked ${tokenSymbol} successfully`,
        failure: `Could not stake ${tokenSymbol}`,
      });

      updateBalance();
      updateAllowance(poolContractAddress);
      refetchInfo();

      return txnStatus;
    } catch (err) {
      notifyError(err, `stake ${tokenSymbol}`);
    } finally {
      setDepositing(false);
    }
  };

  useEffect(() => {
    let msg = "";

    if (isGreater(convertToUnits(value || "0").toString(), maxStakableAmount)) {
      msg = "Maximum Limit Reached";
    }

    if (isGreater(convertToUnits(value || "0").toString(), balance)) {
      msg = "Insufficient Balance";
    }

    if (msg !== errorMsg) {
      setErrorMsg(msg);
    }
  }, [balance, errorMsg, value, maxStakableAmount]);

  const canDeposit =
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(allowance, convertToUnits(value || "0"));

  const isError = value && (!isValidNumber(value) || errorMsg);

  return {
    balance,
    maxStakableAmount,

    isError,
    errorMsg,

    approving,
    depositing,

    canDeposit,

    handleApprove,
    handleDeposit,
  };
};
