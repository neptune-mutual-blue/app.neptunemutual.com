import { useState } from 'react'
import { t } from '@lingui/macro'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useNetwork } from '@/src/context/Network'
import { useAuthValidation } from '@/src/hooks/useAuthValidation'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useTxPoster } from '@/src/context/TxPoster'
import { useTxToast } from '@/src/hooks/useTxToast'
import { registry, utils } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { METHODS } from '@/src/services/transactions/const'
import { useActionMessage } from '@/src/helpers/notification'
import { useLingui } from '@lingui/react'

export const useFinalizeIncident = ({ coverKey, productKey, incidentDate }) => {
  const [finalizing, setFinalizing] = useState(false)

  const { account, library } = useWeb3React()
  const { networkId } = useNetwork()
  const { requiresAuth } = useAuthValidation()

  const txToast = useTxToast()
  const { notifyError } = useErrorNotifier()
  const { writeContract } = useTxPoster()

  const { i18n } = useLingui()

  const { getActionMessage } = useActionMessage()

  const finalize = async (onSuccess = (f) => { return f }) => {
    if (!networkId || !account) {
      requiresAuth()

      return
    }

    setFinalizing(true)
    const cleanup = () => {
      setFinalizing(false)
    }

    const handleError = (err) => {
      notifyError(err, t(i18n)`Could not finalize incident`)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const instance = await registry.Resolution.getInstance(
        networkId,
        signerOrProvider
      )

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.INCIDENT_FINALIZE,
          status: STATUS.PENDING
        })

        await txToast.push(
          tx,
          {
            pending: getActionMessage(METHODS.INCIDENT_FINALIZE, STATUS.PENDING)
              .title,
            success: getActionMessage(METHODS.INCIDENT_FINALIZE, STATUS.SUCCESS)
              .title,
            failure: getActionMessage(METHODS.INCIDENT_FINALIZE, STATUS.FAILED)
              .title
          },
          {
            onTxSuccess: () => {
              onSuccess()
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.INCIDENT_FINALIZE,
                status: STATUS.SUCCESS
              })
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.INCIDENT_FINALIZE,
                status: STATUS.FAILED
              })
            }
          }
        )

        cleanup()
      }

      const onRetryCancel = () => {
        cleanup()
      }

      const onError = (err) => {
        handleError(err)
        cleanup()
      }

      const productKeyArg = productKey || utils.keyUtil.toBytes32('')
      const args = [coverKey, productKeyArg, incidentDate]
      writeContract({
        instance,
        methodName: 'finalize',
        args,
        onTransactionResult,
        onRetryCancel,
        onError
      })
    } catch (err) {
      handleError(err)
      cleanup()
    }
  }

  return {
    finalize,
    finalizing
  }
}
