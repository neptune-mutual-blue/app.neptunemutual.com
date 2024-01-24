import {
  useEffect,
  useRef
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useNetwork } from '@/src/context/Network'
import { useActionMessage } from '@/src/helpers/notification'
import { useTxToast } from '@/src/hooks/useTxToast'
import { LSHistory } from '@/src/services/transactions/history'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { useWeb3React } from '@web3-react/core'

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

export function useTransactionHistory () {
  const { account, library } = useWeb3React()
  const { networkId } = useNetwork()
  const txToast = useTxToast()

  const init = useRef(true)

  const { getActionMessage } = useActionMessage()

  useEffect(() => {
    LSHistory.init()
  }, [])

  useEffect(() => {
    if (account && networkId) {
      init.current = true
    }
  }, [account, networkId])

  useEffect(() => {
    if (!networkId || !account || !library) { return }

    LSHistory.setId(account, networkId);

    (async () => {
      if (init.current) {
        const signerOrProvider = getProviderOrSigner(
          library,
          account,
          networkId
        )

        if (signerOrProvider && signerOrProvider.provider) {
          init.current = false

          TransactionHistory.process(
            TransactionHistory.callback(signerOrProvider.provider, {
              success: ({ hash, methodName, data }) => {
                if (data?.logData) {
                  delete data.logData
                }

                txToast.pushSuccess(
                  getActionMessage(methodName, STATUS.SUCCESS, data).title,
                  hash
                )
              },
              failure: ({ hash, methodName, data }) => {
                txToast.pushError(
                  getActionMessage(methodName, STATUS.FAILED, data).title,
                  hash
                )
              }
            })
          )
        }
      }
    })()
  }, [account, library, networkId, txToast, getActionMessage])

  return null
}
