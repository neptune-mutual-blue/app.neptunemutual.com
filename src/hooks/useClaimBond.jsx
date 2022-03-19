import { useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useNetwork } from "@/src/context/Network";

export const useClaimBond = () => {
  const [claiming, setClaiming] = useState();

  const { networkId } = useNetwork();
  const { account, library } = useWeb3React();
  const txToast = useTxToast();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  const handleClaim = async () => {
    if (!account || !networkId) {
      return;
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.BondPool.getInstance(
        networkId,
        signerOrProvider
      );

      setClaiming(true);
      const onTransactionResult = async (tx) => {
        await txToast.push(tx, {
          pending: "Claiming NPM",
          success: "Claimed NPM Successfully",
          failure: "Could not claim bond",
        });
        setClaiming(false);
      };

      invoke({
        instance,
        methodName: "claimBond",
        catcher: notifyError,
        onTransactionResult,
      });
    } catch (err) {
      notifyError(err);
    }
  };

  return {
    claiming,
    handleClaim,
  };
};
