import { useState } from 'react'

import { useRouter } from 'next/router'

import { NetworkNames } from '@/lib/connect-wallet/config/chains'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { getActionMessage } from '@/src/helpers/notification'
import { useAuthValidation } from '@/src/hooks/useAuthValidation'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useTxToast } from '@/src/hooks/useTxToast'
import { METHODS } from '@/src/services/transactions/const'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { convertFromUnits } from '@/utils/bn'
import { safeParseBytes32String } from '@/utils/formatter/bytes32String'
import { formatCurrency } from '@/utils/formatter/currency'
import { t } from '@lingui/macro'
import {
  registry,
  utils
} from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

export const useUnstakeReportingStake = ({
  coverKey,
  productKey,
  incidentDate,
  incidentStatus,
  willReceive
}) => {
  const router = useRouter()
  const { account, library } = useWeb3React()
  const { networkId } = useNetwork()

  const txToast = useTxToast()
  const { requiresAuth } = useAuthValidation()
  const { writeContract } = useTxPoster()
  const { notifyError } = useErrorNotifier()
  const [unstaking, setUnstaking] = useState(false)

  const { NPMTokenSymbol, NPMTokenDecimals } = useAppConstants()

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
      notifyError(err, t`Could not unstake ${NPMTokenSymbol}`)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const resolutionContract = await registry.Resolution.getInstance(
        networkId,
        signerOrProvider
      )

      const onTransactionResult = async (tx) => {
        const logData = {
          network: NetworkNames[networkId],
          networkId,
          coverKey,
          coverName: safeParseBytes32String(coverKey),
          productKey,
          productName: safeParseBytes32String(productKey),
          details: {
            sales: 'N/A',
            salesCurrency: 'N/A',
            salesFormatted: 'N/A',
            account,
            tx: tx.hash,
            stake: convertFromUnits(willReceive, NPMTokenDecimals).decimalPlaces(2).toString(),
            stakeCurrency: NPMTokenSymbol,
            stakeFormatted: formatCurrency(convertFromUnits(willReceive, NPMTokenDecimals).toString(), router.locale, NPMTokenSymbol, true).short,
            camp: incidentStatus === 'Claimable' ? 'yes' : 'no',
            withClaim: 'no'
          }
        }

        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.REPORTING_UNSTAKE,
          status: STATUS.PENDING,
          data: {
            tokenSymbol: NPMTokenSymbol,
            logData
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
      notifyError(err, t`Could not unstake & claim ${NPMTokenSymbol}`)
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
