import { t } from '@lingui/macro'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useNetwork } from '@/src/context/Network'
import { useAuthValidation } from '@/src/hooks/useAuthValidation'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useTxPoster } from '@/src/context/TxPoster'
import { useTxToast } from '@/src/hooks/useTxToast'
import { registry, utils } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'
import { useState } from 'react'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { METHODS } from '@/src/services/transactions/const'
import { useActionMessage } from '@/src/helpers/notification'
import { useLingui } from '@lingui/react'

export const useResolveIncident = ({ coverKey, productKey, incidentDate }) => {
  const { account, library } = useWeb3React()
  const { networkId } = useNetwork()
  const { writeContract } = useTxPoster()
  const { requiresAuth } = useAuthValidation()

  const txToast = useTxToast()
  const { notifyError } = useErrorNotifier()

  const [resolving, setResolving] = useState(false)
  const [emergencyResolving, setEmergencyResolving] = useState(false)

  const { i18n } = useLingui()

  const { getActionMessage } = useActionMessage()

  const resolve = async (onSuccess = (f) => { return f }) => {
    if (!networkId || !account) {
      requiresAuth()

      return
    }

    setResolving(true)

    const cleanup = () => {
      setResolving(false)
    }
    const handleError = (err) => {
      notifyError(err, t(i18n)`Could not resolve incident`)
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
          methodName: METHODS.RESOLVE_INCIDENT_APPROVE,
          status: STATUS.PENDING,
          data: {}
        })

        await txToast.push(
          tx,
          {
            pending: getActionMessage(
              METHODS.RESOLVE_INCIDENT_APPROVE,
              STATUS.PENDING
            ).title,
            success: getActionMessage(
              METHODS.RESOLVE_INCIDENT_APPROVE,
              STATUS.SUCCESS
            ).title,
            failure: getActionMessage(
              METHODS.RESOLVE_INCIDENT_APPROVE,
              STATUS.FAILED
            ).title
          },
          {
            onTxSuccess: () => {
              onSuccess()
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.RESOLVE_INCIDENT_APPROVE,
                status: STATUS.SUCCESS
              })
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.RESOLVE_INCIDENT_APPROVE,
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
        methodName: 'resolve',
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

  const emergencyResolve = async (decision, onSuccess = (f) => { return f }) => {
    if (!networkId || !account) {
      requiresAuth()

      return
    }

    setEmergencyResolving(true)

    const cleanup = () => {
      setEmergencyResolving(false)
    }

    const handleError = (err) => {
      notifyError(err, t(i18n)`Could not emergency resolve incident`)
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
          methodName: METHODS.RESOLVE_INCIDENT_COMPLETE,
          status: STATUS.PENDING,
          data: {}
        })

        await txToast.push(
          tx,
          {
            pending: getActionMessage(
              METHODS.RESOLVE_INCIDENT_COMPLETE,
              STATUS.PENDING
            ).title,
            success: getActionMessage(
              METHODS.RESOLVE_INCIDENT_COMPLETE,
              STATUS.SUCCESS
            ).title,
            failure: getActionMessage(
              METHODS.RESOLVE_INCIDENT_COMPLETE,
              STATUS.FAILED
            ).title
          },

          {
            onTxSuccess: () => {
              onSuccess()
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.RESOLVE_INCIDENT_COMPLETE,
                status: STATUS.SUCCESS
              })
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.RESOLVE_INCIDENT_COMPLETE,
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
      const args = [coverKey, productKeyArg, incidentDate, decision]
      writeContract({
        instance,
        methodName: 'emergencyResolve',
        onTransactionResult,
        onRetryCancel,
        onError,
        args
      })
    } catch (err) {
      handleError(err)
      cleanup()
    }
  }

  return {
    resolve,
    emergencyResolve,
    resolving,
    emergencyResolving
  }
}
