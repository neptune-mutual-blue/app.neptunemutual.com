import { useState } from 'react'
import { t } from '@lingui/macro'

import { useWeb3React } from '@web3-react/core'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { registry } from '@neptunemutual/sdk'
import { useTxToast } from '@/src/hooks/useTxToast'
import { useTxPoster } from '@/src/context/TxPoster'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useNetwork } from '@/src/context/Network'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { METHODS } from '@/src/services/transactions/const'
import { useAppConstants } from '@/src/context/AppConstants'
import { getActionMessage } from '@/src/helpers/notification'
import { logBondClaimed } from '@/src/services/logs'
import { analyticsLogger } from '@/utils/logger'
import { NetworkNames } from '@/lib/connect-wallet/config/chains'
import { formatCurrency } from '@/utils/formatter/currency'
import { convertFromUnits } from '@/utils/bn'
import { formatAmount } from '@/utils/formatter'
import { useRouter } from 'next/router'

export const useClaimBond = ({ claimable }) => {
  const [claiming, setClaiming] = useState(false)

  const router = useRouter()
  const { NPMTokenSymbol } = useAppConstants()
  const { networkId } = useNetwork()
  const { account, library } = useWeb3React()
  const txToast = useTxToast()
  const { writeContract } = useTxPoster()
  const { notifyError } = useErrorNotifier()

  const handleClaim = async (onTxSuccess) => {
    if (!account || !networkId) {
      return
    }

    setClaiming(true)
    const cleanup = () => {
      setClaiming(false)
    }
    const handleError = (err) => {
      notifyError(err, t`Could not claim bond`)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)

      const instance = await registry.BondPool.getInstance(
        networkId,
        signerOrProvider
      )

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.BOND_CLAIM,
          status: STATUS.PENDING,
          data: {
            tokenSymbol: NPMTokenSymbol
          }
        })

        await txToast.push(
          tx,
          {
            pending: getActionMessage(METHODS.BOND_CLAIM, STATUS.PENDING, {
              tokenSymbol: NPMTokenSymbol
            }).title,
            success: getActionMessage(METHODS.BOND_CLAIM, STATUS.SUCCESS, {
              tokenSymbol: NPMTokenSymbol
            }).title,
            failure: getActionMessage(METHODS.BOND_CLAIM, STATUS.FAILED, {
              tokenSymbol: NPMTokenSymbol
            }).title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.BOND_CLAIM,
                status: STATUS.SUCCESS
              })
              analyticsLogger(() => logBondClaimed({
                network: NetworkNames[networkId],
                networkId,
                sales: 'N/A',
                salesCurrency: 'N/A',
                salesFormatted: 'N/A',
                account,
                tx: tx.hash,
                allocation: claimable,
                allocationCurrency: NPMTokenSymbol,
                allocationFormatted: formatCurrency(formatAmount(
                  convertFromUnits(claimable).toString(),
                  router.locale
                )).short
              }))
              onTxSuccess()
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.BOND_CLAIM,
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

      writeContract({
        instance,
        methodName: 'claimBond',
        onError,
        onTransactionResult,
        onRetryCancel
      })
    } catch (err) {
      handleError(err)
      cleanup()
    }
  }

  return {
    claiming,
    handleClaim
  }
}
