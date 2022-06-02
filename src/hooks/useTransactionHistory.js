import { useNetwork } from "@/src/context/Network";
import { useWeb3React } from "@web3-react/core";
import { useTxToast } from "@/src/hooks/useTxToast";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useEffect, useRef } from "react";
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
 * @param {(instance: any, txToast: ITxToast) => void} callback
 */
export function useTransactionHistory(callback) {
  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();
  const txToast = useTxToast();

  const init = useRef(true);

  useEffect(() => {
    if (!networkId || !account || !library) return;
    (async () => {
      if (init.current) {
        const signerOrProvider = getProviderOrSigner(
          library,
          account,
          networkId
        );

        if (signerOrProvider && signerOrProvider.provider) {
          init.current = false;
          callback(signerOrProvider.provider, {
            pushSuccess: txToast.pushSuccess,
            pushError: txToast.pushError,
          });
        }
      }
    })();
  }, [account, library, networkId, callback, txToast]);

  return null;
}
