import { useNetwork } from "@/src/context/Network";
import { useWeb3React } from "@web3-react/core";
import { useTxToast } from "@/src/hooks/useTxToast";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";
import { useEffect } from "react";
/**
 * @callback INotify
 * @param {string} title
 * @param {string} hash
 * @returns {void}
 *
 * @typedef ITxToast
 * @prop {INotify} pushSuccess
 * @prop {INotify} pushError
 */

/**
 * @param {string} registryInstance
 * @param {(instance: any, txToast: ITxToast) => void} callback
 */
export function useTransactionHistory(registryInstance, callback) {
  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();
  const txToast = useTxToast();

  useEffect(() => {
    if (!networkId || !account || !library) return;
    (async () => {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry[registryInstance].getInstance(
        networkId,
        signerOrProvider
      );

      if (instance) {
        callback(instance, {
          pushSuccess: txToast.pushSuccess,
          pushError: txToast.pushError,
        });
      }
    })();
  }, [account, callback, library, networkId, registryInstance, txToast]);

  return null;
}
