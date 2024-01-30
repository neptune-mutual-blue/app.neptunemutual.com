import { useState } from 'react'

import { useRouter } from 'next/router'

import { NetworkNames } from '@/lib/connect-wallet/config/chains'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { useActionMessage } from '@/src/helpers/notification'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useTxToast } from '@/src/hooks/useTxToast'
import { METHODS } from '@/src/services/transactions/const'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { convertFromUnits } from '@/utils/bn'
import { formatAmount } from '@/utils/formatter'
import { formatCurrency } from '@/utils/formatter/currency'
import { t } from '@lingui/macro'
import { registry } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'
import { useLingui } from '@lingui/react'

export const useClaimBond = ({ claimable }) => {
  const [claiming, setClaiming] = useState(false)

  const router = useRouter()
  const { NPMTokenSymbol } = useAppConstants()
  const { networkId } = useNetwork()
  const { account, library } = useWeb3React()
  const txToast = useTxToast()
  const { writeContract } = useTxPoster()
  const { notifyError } = useErrorNotifier()

  const { i18n } = useLingui()

  const { getActionMessage } = useActionMessage()

  const handleClaim = async (onTxSuccess) => {
    if (!account || !networkId) {
      return
    }

    setClaiming(true)
    const cleanup = () => {
      setClaiming(false)
    }
    const handleError = (err) => {
      notifyError(err, t(i18n)`Could not claim bond`)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)

      const instance = await registry.BondPool.getInstance(
        networkId,
        signerOrProvider
      )

      const onTransactionResult = async (tx) => {
        const logData = {
          network: NetworkNames[networkId],
          networkId,
          sales: 'N/A',
          salesCurrency: 'N/A',
          salesFormatted: 'N/A',
          account,
          tx: tx.hash,
          allocation: claimable,
          allocationCurrency: NPMTokenSymbol,
          allocationFormatted: formatCurrency(
            formatAmount(
              convertFromUnits(claimable).toString(),
              router.locale
            )).short
        }

        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.BOND_CLAIM,
          status: STATUS.PENDING,
          data: {
            tokenSymbol: NPMTokenSymbol,
            logData
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
