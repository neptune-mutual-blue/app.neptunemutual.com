import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { registry } from "@neptunemutual/sdk";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import DateLib from "@/lib/date/DateLib";
import { t } from "@lingui/macro";

const defaultExpiry = DateLib.unix();

export const usePolicyExpiry = ({ coverMonth }) => {
  const { library, account } = useWeb3React();
  const { networkId } = useNetwork();

  const [expiresAt, setExpiresAt] = useState(defaultExpiry);
  const [loading, setLoading] = useState(false);
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    let ignore = false;

    if (!networkId || !account || !coverMonth) {
      return;
    }

    const today = DateLib.unix();

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    async function exec() {
      setLoading(true);

      const cleanup = () => {
        setLoading(false);
      };

      const handleError = (err) => {
        notifyError(err, t`get expiry date`);
      };

      try {
        const policyInstance = await registry.PolicyContract.getInstance(
          networkId,
          signerOrProvider
        );

        const args = [today, parseInt(coverMonth, 10)];

        const onTransactionResult = (result) => {
          if (ignore) return;
          cleanup();
          setExpiresAt(result.toString());
        };

        const onRetryCancel = () => {
          cleanup();
        };

        const onError = (err) => {
          handleError(err);
          cleanup();
        };

        invoke({
          instance: policyInstance,
          methodName: "getExpiryDate",
          args,
          retry: false,
          onTransactionResult,
          onRetryCancel,
          onError,
        });
      } catch (err) {
        handleError(err);
        cleanup();
      }
    }

    exec();
    return () => {
      ignore = true;
    };
  }, [account, coverMonth, invoke, library, networkId, notifyError]);

  return {
    loading,
    expiresAt,
  };
};
