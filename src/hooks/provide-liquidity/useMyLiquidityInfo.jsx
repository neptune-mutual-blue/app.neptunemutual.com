import { useState, useEffect } from "react";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";
import { AddressZero } from "@ethersproject/constants";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";

export const useMyLiquidityInfo = ({ coverKey }) => {
  const { library, account } = useWeb3React();
  const { networkId } = useAppContext();

  const [info, setInfo] = useState({
    totalPods: "0",
    balance: "0",
    extendedBalance: "0",
    totalReassurance: "0",
    lockup: "0",
    myPodBalance: "0",
    myDeposits: "0",
    myWithdrawals: "0",
    myShare: "0",
    releaseDate: "0",
  });

  useEffect(() => {
    let ignore = false;

    if (!networkId || !coverKey) {
      return;
    }

    const signerOrProvider = getProviderOrSigner(
      library,
      account || AddressZero,
      networkId
    );

    async function fetchInfo() {
      try {
        const instance = await registry.Vault.getInstance(
          networkId,
          coverKey,
          signerOrProvider
        );

        const [
          totalPods,
          balance,
          extendedBalance,
          totalReassurance,
          lockup,
          myPodBalance,
          myDeposits,
          myWithdrawals,
          myShare,
          releaseDate,
        ] = await instance.getInfo(account || AddressZero);

        if (ignore) return;

        setInfo({
          totalPods: totalPods.toString(),
          balance: balance.toString(),
          extendedBalance: extendedBalance.toString(),
          totalReassurance: totalReassurance.toString(),
          lockup: lockup.toString(),
          myPodBalance: myPodBalance.toString(),
          myDeposits: myDeposits.toString(),
          myWithdrawals: myWithdrawals.toString(),
          myShare: myShare.toString(),
          releaseDate: releaseDate.toString(),
        });
      } catch (error) {
        console.error(error);
      }
    }

    fetchInfo();
    return () => (ignore = true);
  }, [account, coverKey, library, networkId]);

  return {
    info,
  };
};
