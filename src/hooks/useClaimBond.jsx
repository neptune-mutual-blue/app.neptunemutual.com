import { useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";
import { useTxToast } from "@/src/hooks/useTxToast";
import DateLib from "@/lib/date/DateLib";
import { useToast } from "@/lib/toast/context";
import { TOAST_DEFAULT_TIMEOUT } from "@/src/config/toast";

export const useClaimBond = (unlockDate) => {
  const [claiming, setClaiming] = useState();
  const { chainId, account, library } = useWeb3React();

  const toast = useToast();
  const txToast = useTxToast();

  const handleClaim = async () => {
    if (!account || !chainId) {
      return;
    }

    const now = DateLib.unix();
    if (now < unlockDate) {
      toast?.pushError({
        title: "Claim Error",
        message: "Could not claim before unlock date",
        lifetime: TOAST_DEFAULT_TIMEOUT,
      });
      return;
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, chainId);

      setClaiming(true);
      const instance = await registry.BondPool.getInstance(
        chainId,
        signerOrProvider
      );

      let tx = await instance.claimBond();

      await txToast.push(tx, {
        pending: "Claiming NPM",
        success: "Claimed NPM Successfully",
        failure: "Could not claim bond",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setClaiming(false);
    }
  };

  return {
    claiming,
    handleClaim,
  };
};
