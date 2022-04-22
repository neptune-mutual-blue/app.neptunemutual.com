import { useState, useEffect } from "react";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { t } from "@lingui/macro";

export const useCommitment = ({ coverKey }) => {
  const { library, account } = useWeb3React();
  const { networkId } = useNetwork();

  const [data, setData] = useState("0");
  const { notifyError } = useErrorNotifier();
  const { invoke } = useInvokeMethod();

  useEffect(() => {
    let ignore = false;

    if (!networkId || !account || !coverKey) {
      return;
    }

    const handleError = (err) => {
      notifyError(err, t`get commitment`);
    };

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    async function fetchAvailableLiquidity() {
      try {
        const instance = await registry.PolicyContract.getInstance(
          networkId,
          signerOrProvider
        );

        const onTransactionResult = (result) => {
          const commitment = result.toString();

          if (ignore) return;
          setData(commitment);
        };

        const onRetryCancel = () => {};

        const onError = (err) => {
          handleError(err);
        };

        const args = [coverKey];
        invoke({
          instance,
          methodName: "getCommitment",
          onTransactionResult,
          onRetryCancel,
          onError,
          args,
          retry: false,
        });
      } catch (err) {
        handleError(err);
      }
    }

    fetchAvailableLiquidity();
    return () => {
      ignore = true;
    };
  }, [account, coverKey, invoke, library, networkId, notifyError]);

  return {
    commitment: data,
  };
};
