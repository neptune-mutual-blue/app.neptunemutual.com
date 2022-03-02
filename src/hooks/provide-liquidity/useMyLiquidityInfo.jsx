import { useState, useEffect } from "react";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";
import { ADDRESS_ONE } from "@/src/config/constants";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";

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

  const { library, account } = useWeb3React();
  const { networkId } = useAppContext();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    let ignore = false;

    if (!networkId || !coverKey) {
      return;
    }

    const signerOrProvider = getProviderOrSigner(
      library,
      account || ADDRESS_ONE,
      networkId
    );

    async function fetchInfo() {
      try {
        const instance = await registry.Vault.getInstance(
          networkId,
          coverKey,
          signerOrProvider
        );

        const args = [account || ADDRESS_ONE];
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

        if (ignore) return;

        setInfo({
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
        });
      } catch (error) {
        console.error(error);
      }
    }

    fetchInfo();
    return () => {
      ignore = true;
    };
  }, [account, coverKey, library, networkId]);

  return {
    info,
  };
};
