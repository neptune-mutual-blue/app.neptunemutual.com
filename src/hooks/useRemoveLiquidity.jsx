import { t } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { registry } from '@neptunemutual/sdk'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { convertToUnits } from '@/utils/bn'
import { useTxToast } from '@/src/hooks/useTxToast'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { useEffect, useState } from 'react'
import { useERC20Allowance } from '@/src/hooks/useERC20Allowance'
import { useLiquidityFormsContext } from '@/common/LiquidityForms/LiquidityFormsContext'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { METHODS } from '@/src/services/transactions/const'
import { getActionMessage } from '@/src/helpers/notification'

export const useRemoveLiquidity = ({ coverKey, value, npmValue }) => {
  const [approving, setApproving] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)
  const { library, account } = useWeb3React()
  const { networkId } = useNetwork()
  const {
    info: { vault: vaultTokenAddress, vaultTokenSymbol },
    refetchInfo,
    updateStakingTokenBalance
  } = useLiquidityFormsContext()
  const {
    allowance,
    approve,
    loading: loadingAllowance,
    refetch: updateAllowance
  } = useERC20Allowance(vaultTokenAddress)

  const txToast = useTxToast()
  const { notifyError } = useErrorNotifier()
  const { writeContract } = useTxPoster()

  useEffect(() => {
    updateAllowance(vaultTokenAddress)
  }, [vaultTokenAddress, updateAllowance])

  const handleApprove = async () => {
    setApproving(true)
    const cleanup = () => {
      setApproving(false)
    }
    const handleError = (err) => {
      notifyError(err, t`Could not approve ${vaultTokenSymbol} tokens`)
    }

    const onTransactionResult = async (tx) => {
      TransactionHistory.push({
        hash: tx.hash,
        methodName: METHODS.LIQUIDITY_TOKEN_APPROVE,
        status: STATUS.PENDING,
        data: {
          tokenSymbol: vaultTokenSymbol
        }
      })

      try {
        await txToast.push(tx, {
          pending: getActionMessage(
            METHODS.LIQUIDITY_TOKEN_APPROVE,
            STATUS.PENDING,
            {
              tokenSymbol: vaultTokenSymbol
            }
          ).title,
          success: getActionMessage(
            METHODS.LIQUIDITY_TOKEN_APPROVE,
            STATUS.SUCCESS,
            {
              tokenSymbol: vaultTokenSymbol
            }
          ).title,
          failure: getActionMessage(
            METHODS.LIQUIDITY_TOKEN_APPROVE,
            STATUS.FAILED,
            {
              tokenSymbol: vaultTokenSymbol
            }
          ).title
        })
        cleanup()
      } catch (err) {
        handleError(err)
        cleanup()
      }
    }

    const onRetryCancel = () => {
      cleanup()
    }

    const onError = (err) => {
      handleError(err)
      cleanup()
    }

    approve(vaultTokenAddress, convertToUnits(value).toString(), {
      onTransactionResult,
      onRetryCancel,
      onError
    })
  }

  const handleWithdraw = async (onTxSuccess, exit) => {
    if (!networkId || !account) return

    setWithdrawing(true)
    const cleanup = () => {
      setWithdrawing(false)
      updateAllowance(vaultTokenAddress)

      // Both NPM and DAI should be updated after withdrawal is successful
      // Will be reflected in provide liquidity form
      refetchInfo()
      updateStakingTokenBalance()
    }

    const handleError = (err) => {
      notifyError(err, t`Could not remove liquidity`)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const instance = await registry.Vault.getInstance(
        networkId,
        coverKey,
        signerOrProvider
      )

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.LIQUIDITY_REMOVE,
          status: STATUS.PENDING
        })

        await txToast.push(
          tx,
          {
            pending: getActionMessage(METHODS.LIQUIDITY_REMOVE, STATUS.PENDING)
              .title,
            success: getActionMessage(METHODS.LIQUIDITY_REMOVE, STATUS.SUCCESS)
              .title,
            failure: getActionMessage(METHODS.LIQUIDITY_REMOVE, STATUS.FAILED)
              .title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.LIQUIDITY_REMOVE,
                status: STATUS.SUCCESS
              })
              onTxSuccess()
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.LIQUIDITY_REMOVE,
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

      const args = [
        coverKey,
        convertToUnits(value).toString(),
        convertToUnits(npmValue).toString(),
        exit
      ]
      writeContract({
        instance,
        methodName: 'removeLiquidity',
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
    allowance,
    loadingAllowance,

    approving,
    withdrawing,

    handleApprove,
    handleWithdraw
  }
}
