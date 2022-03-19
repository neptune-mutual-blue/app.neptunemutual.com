import { useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";
import { convertToUnits } from "@/utils/bn";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useNetwork } from "@/src/context/Network";

export const useStakingPoolWithdraw = ({
  value,
  poolKey,
  tokenSymbol,
  refetchInfo,
}) => {
  const [withdrawing, setWithdrawing] = useState(false);

  const { networkId } = useNetwork();
  const { account, library } = useWeb3React();

  const txToast = useTxToast();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  const handleWithdraw = async () => {
    if (!account || !networkId) {
      return;
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      setWithdrawing(true);
      const instance = await registry.StakingPools.getInstance(
        networkId,
        signerOrProvider
      );

      const args = [poolKey, convertToUnits(value).toString()];
      const tx = await invoke(instance, "withdraw", {}, notifyError, args);

      await txToast.push(tx, {
        pending: `Unstaking ${tokenSymbol}`,
        success: `Unstaked ${tokenSymbol} successfully`,
        failure: `Could not unstake ${tokenSymbol}`,
      });

      refetchInfo();
    } catch (err) {
      notifyError(err, `unstake ${tokenSymbol}`);
    } finally {
      setWithdrawing(false);
    }
  };

  return {
    withdrawing,
    handleWithdraw,
  };
};

export const useStakingPoolWithdrawRewards = ({ poolKey, refetchInfo }) => {
  const [withdrawingRewards, setWithdrawingRewards] = useState(false);

  const { networkId } = useNetwork();
  const { account, library } = useWeb3React();

  const txToast = useTxToast();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  const handleWithdrawRewards = async () => {
    if (!account || !networkId) {
      return;
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      setWithdrawingRewards(true);
      const instance = await registry.StakingPools.getInstance(
        networkId,
        signerOrProvider
      );

      const args = [poolKey];
      const tx = await invoke(
        instance,
        "withdrawRewards",
        {},
        notifyError,
        args
      );

      await txToast.push(tx, {
        pending: `Withdrawing rewards`,
        success: `Withdrawn rewards successfully`,
        failure: `Could not withdraw rewards`,
      });

      refetchInfo();
    } catch (err) {
      console.error(err);
    } finally {
      setWithdrawingRewards(false);
    }
  };

  return {
    withdrawingRewards,
    handleWithdrawRewards,
  };
};
