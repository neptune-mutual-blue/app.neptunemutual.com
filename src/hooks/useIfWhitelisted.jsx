import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { registry } from "@neptunemutual/sdk";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";

import { useNetwork } from "@/src/context/Network";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";

export const useIfWhitelisted = ({ coverKey }) => {
  const [isUserWhitelisted, setIsUserWhitelisted] = useState(false);

  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    if (!networkId || !account) return;

    let ignore = false;

    const handleError = (err) => {
      notifyError(err, "getting user whitelisted");
    };

    async function checkWhitelisted() {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.Cover.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = (result) => {
        const whitelisted = result;
        if (ignore) return;
        if (whitelisted) {
          setIsUserWhitelisted(true);
        }
      };

      const onRetryCancel = () => {};

      const onError = (err) => {
        handleError(err);
      };

      invoke({
        instance,
        methodName: "checkIfWhitelistedUser",
        args: [coverKey, account],
        onTransactionResult,
        onRetryCancel,
        onError,
      });
    }

    checkWhitelisted().catch((err) => {
      handleError(err);
    });

    return () => {
      ignore = true;
    };
  }, [account, coverKey, invoke, library, networkId, notifyError]);

  return {
    isUserWhitelisted,
  };
};
