import { useState, useEffect } from "react";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";
import { AddressZero } from "@ethersproject/constants";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/components/UI/organisms/AppWrapper";
import { convertFromUnits } from "@/utils/bn";

export const useMyLiquidityInfo = ({ coverKey }) => {
  const { library, account } = useWeb3React();
  const { networkId } = useAppContext();

  const [info, setInfo] = useState({});

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
          totalPods: convertFromUnits(totalPods).toString(),
          balance: convertFromUnits(balance).toString(),
          extendedBalance: convertFromUnits(extendedBalance).toString(),
          totalReassurance: convertFromUnits(totalReassurance).toString(),
          lockup: lockup.toString(),
          myPodBalance: convertFromUnits(myPodBalance).toString(),
          myDeposits: convertFromUnits(myDeposits).toString(),
          myWithdrawals: convertFromUnits(myWithdrawals).toString(),
          myShare: convertFromUnits(myShare).toString(),
          releaseDate: releaseDate.toString(),
        });
      } catch (error) {
        console.log(error);
      }
    }

    fetchInfo();
    return () => (ignore = true);
  }, [account, coverKey, library, networkId]);

  return {
    info,
  };
};
