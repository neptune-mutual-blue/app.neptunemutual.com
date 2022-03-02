import { useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";

export const useClaimBond = () => {
  const [claiming, setClaiming] = useState();
  const { chainId, account, library } = useWeb3React();

  const txToast = useTxToast();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  const handleClaim = async () => {
    if (!account || !chainId) {
      return;
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, chainId);

      setClaiming(true);
      const instance = await registry.BondPool.getInstance(
        chainId,
        signerOrProvider
      );

      let tx = await invoke(instance, "claimBond", {}, notifyError, []);

      await txToast.push(tx, {
        pending: "Claiming NPM",
        success: "Claimed NPM Successfully",
        failure: "Could not claim bond",
      });
    } catch (err) {
      notifyError(err);
    } finally {
      setClaiming(false);
    }
  };

  return {
    claiming,
    handleClaim,
  };
};
