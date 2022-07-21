import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { registry } from "@neptunemutual/sdk";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";

import { useNetwork } from "@/src/context/Network";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useTxPoster } from "@/src/context/TxPoster";
import { t } from "@lingui/macro";

export const useFirstReportingStake = ({ coverKey }) => {
  const [minStake, setMinStake] = useState("0");
  const [fetchingMinStake, setFetchingMinStake] = useState(false);

  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();
  const { writeContract } = useTxPoster();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    if (!networkId || !account) return;

    let ignore = false;

    const handleError = (err) => {
      notifyError(err, t`get first reporting stake`);
    };

    async function fetchMinStake() {
      setFetchingMinStake(true);
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.Governance.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = (result) => {
        const minStake = result;
        if (ignore) return;
        setMinStake(minStake.toString());
        setFetchingMinStake(false);
      };

      const onRetryCancel = () => {};

      const onError = (err) => {
        handleError(err);
      };

      writeContract({
        instance,
        methodName: "getFirstReportingStake",
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
  }, [account, coverKey, writeContract, library, networkId, notifyError]);

  return {
    minStake,
    fetchingMinStake,
  };
};
