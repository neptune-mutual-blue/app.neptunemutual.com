import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { registry } from "@neptunemutual/sdk";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";

import { useNetwork } from "@/src/context/Network";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";

export const useFirstReportingStake = ({ coverKey }) => {
  const [minStake, setMinStake] = useState("0");

  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    if (!networkId || !account) return;

    let ignore = false;

    const handleError = (err) => {
      notifyError(err, "get first reporting stake");
    };

    async function fetchMinStake() {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.Governance.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = (result) => {
        const minStake = result;
        if (ignore) return;
        setMinStake(minStake.toString());
      };

      const onRetryCancel = () => {};

      const onError = (err) => {
        handleError(err);
      };

      invoke({
        instance,
        methodName: "getFirstReportingStake(bytes32)",
        args: [coverKey],
        onTransactionResult,
        onRetryCancel,
        onError,
      });
    }

    fetchMinStake().catch((err) => {
      handleError(err);
    });

    return () => {
      ignore = true;
    };
  }, [account, coverKey, invoke, library, networkId, notifyError]);

  return {
    minStake,
  };
};
