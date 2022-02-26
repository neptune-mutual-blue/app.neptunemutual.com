import { useEffect, useState } from "react";
import { AddressZero } from "@ethersproject/constants";
import { useWeb3React } from "@web3-react/core";
import { registry } from "@neptunemutual/sdk";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";

import { useAppContext } from "@/src/context/AppWrapper";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";

export const useFirstReportingStake = ({ coverKey }) => {
  const [minStake, setMinStake] = useState("0");

  const { account, library } = useWeb3React();
  const { networkId } = useAppContext();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    if (!networkId) return;

    let ignore = false;
    async function fetchMinStake() {
      const signerOrProvider = getProviderOrSigner(
        library,
        account || AddressZero,
        networkId
      );

      const instance = await registry.Governance.getInstance(
        networkId,
        signerOrProvider
      );

      const args = [coverKey];
      const minStake = await invoke(
        instance,
        "getFirstReportingStake(bytes32)",
        {},
        notifyError,
        args
      );

      if (ignore) return;
      setMinStake(minStake.toString());
    }

    fetchMinStake().catch((err) => {
      notifyError(err, "get first reporting stake");
    });

    return () => {
      ignore = true;
    };
  }, [account, coverKey, invoke, library, networkId, notifyError]);

  return {
    minStake,
  };
};
