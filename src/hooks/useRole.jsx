import { useCallback } from "react";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useTxPoster } from "@/src/context/TxPoster";
import { registry, utils } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { t } from "@lingui/macro";

export const useRole = () => {
  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();
  const { contractRead } = useTxPoster();
  const { notifyError } = useErrorNotifier();

  const checkHasRole = useCallback(
    async (roleString) => {
      if (!networkId || !account) {
        return;
      }

      const handleError = (err) => {
        notifyError(err, t`Account role`);
      };

      try {
        const signerOrProvider = getProviderOrSigner(
          library,
          account,
          networkId
        );

        const instance = await registry.Protocol.getInstance(
          networkId,
          signerOrProvider
        );

        const onError = (err) => {
          handleError(err);
        };

        const role = utils.keyUtil.toBytes32(roleString);
        const args = [role, account];

        const hasRole = await contractRead({
          instance,
          methodName: "hasRole",
          onError,
          args,
        });

        return hasRole;
      } catch (err) {
        handleError(err);
      }
    },
    [account, contractRead, library, networkId, notifyError]
  );

  return {
    checkHasRole,
  };
};
