import { useState } from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { useActionMessage } from '@/src/helpers/notification'
import { useAuthValidation } from '@/src/hooks/useAuthValidation'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useTxToast } from '@/src/hooks/useTxToast'
import { METHODS } from '@/src/services/transactions/const'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { t } from '@lingui/macro'
import {
  registry,
  utils
} from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'
import { useLingui } from '@lingui/react'

export const useUnstakeReportingStake = ({
  coverKey,
  productKey,
  incidentDate
}) => {
  const { account, library } = useWeb3React()
  const { networkId } = useNetwork()

  const txToast = useTxToast()
  const { requiresAuth } = useAuthValidation()
  const { writeContract } = useTxPoster()
  const { notifyError } = useErrorNotifier()
  const [unstaking, setUnstaking] = useState(false)

  const { NPMTokenSymbol } = useAppConstants()

  const { i18n } = useLingui()

  const { getActionMessage } = useActionMessage()

  const unstake = async (onTxSuccess = () => {}) => {
    if (!networkId || !account) {
      requiresAuth()

      return
    }

    setUnstaking(true)
    const cleanup = () => {
      setUnstaking(false)
    }
    const handleError = (err) => {
      notifyError(err, t(i18n)`Could not unstake ${NPMTokenSymbol}`)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const resolutionContract = await registry.Resolution.getInstance(
        networkId,
        signerOrProvider
      )

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.REPORTING_UNSTAKE,
          status: STATUS.PENDING,
          data: {
            tokenSymbol: NPMTokenSymbol
          }
        })

        await txToast.push(
          tx,
          {
            pending: getActionMessage(
              METHODS.REPORTING_UNSTAKE,
              STATUS.PENDING,
              {
                tokenSymbol: NPMTokenSymbol
              }
            ).title,
            success: getActionMessage(
              METHODS.REPORTING_UNSTAKE,
              STATUS.SUCCESS,
              {
                tokenSymbol: NPMTokenSymbol
              }
            ).title,
            failure: getActionMessage(
              METHODS.REPORTING_UNSTAKE,
              STATUS.FAILED,
              {
                tokenSymbol: NPMTokenSymbol
              }
            ).title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.REPORTING_UNSTAKE,
                status: STATUS.SUCCESS,
                data: {
                  tokenSymbol: NPMTokenSymbol
                }
              })

              onTxSuccess()
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.REPORTING_UNSTAKE,
                status: STATUS.FAILED,
                data: {
                  tokenSymbol: NPMTokenSymbol
                }
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

      const _productKey = productKey ?? utils.keyUtil.toBytes32('')
      const args = [coverKey, _productKey, incidentDate]
      writeContract({
        instance: resolutionContract,
        methodName: 'unstake',
        onError,
        onTransactionResult,
        onRetryCancel,
        args
      })
    } catch (err) {
      cleanup()
      handleError(err)
    }
  }

  const unstakeWithClaim = async (onTxSuccess = () => {}) => {
    if (!networkId || !account) {
      requiresAuth()

      return
    }

    setUnstaking(true)
    const cleanup = () => {
      setUnstaking(false)
    }

    const handleError = (err) => {
      notifyError(err, t(i18n)`Could not unstake & claim ${NPMTokenSymbol}`)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const resolutionContract = await registry.Resolution.getInstance(
        networkId,
        signerOrProvider
      )

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.REPORTING_UNSTAKE_CLAIM,
          status: STATUS.PENDING,
          data: {
            tokenSymbol: NPMTokenSymbol
          }
        })

        await txToast.push(
          tx,
          {
            pending: getActionMessage(
              METHODS.REPORTING_UNSTAKE_CLAIM,
              STATUS.PENDING,
              {
                tokenSymbol: NPMTokenSymbol
              }
            ).title,
            success: getActionMessage(
              METHODS.REPORTING_UNSTAKE_CLAIM,
              STATUS.SUCCESS,
              {
                tokenSymbol: NPMTokenSymbol
              }
            ).title,
            failure: getActionMessage(
              METHODS.REPORTING_UNSTAKE_CLAIM,
              STATUS.FAILED,
              {
                tokenSymbol: NPMTokenSymbol
              }
            ).title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.REPORTING_UNSTAKE_CLAIM,
                status: STATUS.SUCCESS,
                data: {
                  tokenSymbol: NPMTokenSymbol
                }
              })

              onTxSuccess()
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.REPORTING_UNSTAKE_CLAIM,
                status: STATUS.FAILED,
                data: {
                  tokenSymbol: NPMTokenSymbol
                }
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

      const _productKey = productKey ?? utils.keyUtil.toBytes32('')
      const args = [coverKey, _productKey, incidentDate]
      writeContract({
        instance: resolutionContract,
        methodName: 'unstakeWithClaim',
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
    unstake,
    unstakeWithClaim,
    unstaking
  }
}
