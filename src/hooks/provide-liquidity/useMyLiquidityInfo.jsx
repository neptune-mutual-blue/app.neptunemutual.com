import { useState, useEffect, useCallback } from "react";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { getRemainingMinStakeToAddLiquidity } from "@/src/helpers/store/getRemainingMinStakeToAddLiquidity";
import { useTxToast } from "@/src/hooks/useTxToast";
import DateLib from "@/lib/date/DateLib";
import { isGreater } from "@/utils/bn";

const defaultInfo = {
  totalPods: "0",
  balance: "0",
  extendedBalance: "0",
  totalReassurance: "0",
  myPodBalance: "0",
  myDeposits: "0",
  myWithdrawals: "0",
  myShare: "0",
  withdrawalOpen: "0",
  withdrawalClose: "0",
};
export const useMyLiquidityInfo = ({ coverKey }) => {
  const [info, setInfo] = useState(defaultInfo);
  const [minNpmStake, setMinNpmStake] = useState("0");
  const [myStake, setMyStake] = useState("0");

  const { library, account } = useWeb3React();
  const { networkId } = useNetwork();
  const txToast = useTxToast();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  const fetchInfo = useCallback(async () => {
    if (!networkId || !account || !coverKey) {
      return;
    }

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    try {
      const instance = await registry.Vault.getInstance(
        networkId,
        coverKey,
        signerOrProvider
      );

      const args = [account];
      const [
        totalPods,
        balance,
        extendedBalance,
        totalReassurance,
        myPodBalance,
        myDeposits,
        myWithdrawals,
        myShare,
        withdrawalOpen,
        withdrawalClose,
      ] = await invoke(instance, "getInfo", {}, notifyError, args, false);

      return {
        totalPods: totalPods.toString(),
        balance: balance.toString(),
        extendedBalance: extendedBalance.toString(),
        totalReassurance: totalReassurance.toString(),
        myPodBalance: myPodBalance.toString(),
        myDeposits: myDeposits.toString(),
        myWithdrawals: myWithdrawals.toString(),
        myShare: myShare.toString(),
        withdrawalOpen: withdrawalOpen.toString(),
        withdrawalClose: withdrawalClose.toString(),
      };
    } catch (error) {
      console.error(error);
    }
  }, [account, coverKey, invoke, library, networkId, notifyError]);

  useEffect(() => {
    let ignore = false;

    fetchInfo().then((_info) => {
      if (!_info || ignore) return;

      setInfo(_info);
    });
    return () => {
      ignore = true;
    };
  }, [fetchInfo]);

  const updateInfo = useCallback(async () => {
    fetchInfo().then((_info) => {
      if (!_info) return;

      setInfo(_info);
    });
  }, [fetchInfo]);

  useEffect(() => {
    let ignore = false;
    if (!networkId || !account || !coverKey) return;

    async function fetchMinStake() {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const { remaining: _minNpmStake, myStake: _myStake } =
        await getRemainingMinStakeToAddLiquidity(
          networkId,
          coverKey,
          account,
          signerOrProvider.provider
        );

      if (ignore) return;
      setMinNpmStake(_minNpmStake);
      setMyStake(_myStake);
    }

    fetchMinStake();

    return () => {
      ignore = true;
    };
  }, [account, coverKey, library, networkId]);

  const accrueInterest = async () => {
    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.Vault.getInstance(
        networkId,
        coverKey,
        signerOrProvider
      );

      const tx = await invoke(instance, "accrueInterest", {}, notifyError, []);

      await txToast.push(tx, {
        pending: "Accruing intrest",
        success: "Accrued intrest successfully",
        failure: "Could not accrue interest",
      });
    } catch (err) {
      notifyError(err, "accrue interest");
    } finally {
    }
  };

  const now = DateLib.unix();
  const canAccrue =
    account &&
    isGreater(now, info.withdrawalOpen) &&
    isGreater(info.withdrawalClose, now);

  return {
    info,
    minNpmStake,
    myStake,

    canAccrue,
    accrueInterest,

    refetch: updateInfo,
  };
};
