import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";

import { useAppContext } from "@/src/context/AppWrapper";
import { ADDRESS_ONE } from "@/src/config/constants";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";

const defaultInfo = {
  lpTokenAddress: "",
  marketPrice: "0",
  discountRate: "0",
  vestingTerm: "0",
  maxBond: "0",
  totalNpmAllocated: "0",
  totalNpmDistributed: "0",
  npmAvailable: "0",
  bondContribution: "0",
  claimable: "0",
  unlockDate: "0",
};

export const useBondInfo = () => {
  const [info, setInfo] = useState(defaultInfo);

  const { account, library } = useWeb3React();
  const { networkId } = useAppContext();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    let ignore = false;
    if (!networkId) {
      return;
    }

    const signerOrProvider = getProviderOrSigner(
      library,
      account || ADDRESS_ONE,
      networkId
    );

    async function fetchBondInfo() {
      let instance = await registry.BondPool.getInstance(
        networkId,
        signerOrProvider
      );

      const [addresses, values] = await invoke(
        instance,
        "getInfo",
        {},
        notifyError,
        [account || ADDRESS_ONE],
        false
      );

      if (ignore) return;

      const [lpToken] = addresses;
      const [
        marketPrice,
        discountRate,
        vestingTerm,
        maxBond,
        totalNpmAllocated,
        totalNpmDistributed,
        npmAvailable,
        bondContribution,
        claimable,
        unlockDate,
      ] = values;

      setInfo({
        lpTokenAddress: lpToken,
        marketPrice: marketPrice.toString(),
        discountRate: discountRate.toString(),
        vestingTerm: vestingTerm.toString(),
        maxBond: maxBond.toString(),
        totalNpmAllocated: totalNpmAllocated.toString(),
        totalNpmDistributed: totalNpmDistributed.toString(),
        npmAvailable: npmAvailable.toString(),
        bondContribution: bondContribution.toString(),
        claimable: claimable.toString(),
        unlockDate: unlockDate.toString(),
      });
    }

    fetchBondInfo();

    return () => {
      ignore = true;
    };
  }, [account, library, networkId]);

  return { info };
};
