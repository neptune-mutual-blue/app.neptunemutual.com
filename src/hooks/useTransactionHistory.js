import { useNetwork } from "@/src/context/Network";
import { useWeb3React } from "@web3-react/core";
import { useTxToast } from "@/src/hooks/useTxToast";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useEffect, useRef } from "react";
import {
  STATUS,
  TransactionHistory,
} from "@/src/services/transactions/transaction-history";
import { getActionMessage } from "@/src/helpers/notification";
import { LSHistory } from "@/src/services/transactions/history";
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

export function useTransactionHistory() {
  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();
  const txToast = useTxToast();

  const init = useRef(true);

  useEffect(() => {
    LSHistory.init();
  }, []);

  useEffect(() => {
    if (account && networkId) {
      init.current = true;
    }
  }, [account, networkId]);

  useEffect(() => {
    if (!networkId || !account || !library) return;

    LSHistory.setId(account, networkId);

    (async () => {
      if (init.current) {
        const signerOrProvider = getProviderOrSigner(
          library,
          account,
          networkId
        );

        if (signerOrProvider && signerOrProvider.provider) {
          init.current = false;

          TransactionHistory.process(
            TransactionHistory.callback(signerOrProvider.provider, {
              success: ({ hash, methodName, data }) => {
                txToast.pushSuccess(
                  getActionMessage(methodName, STATUS.SUCCESS, data).title,
                  hash
                );
              },
              failure: ({ hash, methodName, data }) => {
                txToast.pushSuccess(
                  getActionMessage(methodName, STATUS.FAILED, data).title,
                  hash
                );
              },
            })
          );
        }
      }
    })();
  }, [account, library, networkId, txToast]);

  return null;
}
