import { useState, useEffect } from 'react'
import { registry, utils } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

import {
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber
} from '@/utils/bn'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useTxToast } from '@/src/hooks/useTxToast'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useNetwork } from '@/src/context/Network'
import { useERC20Allowance } from '@/src/hooks/useERC20Allowance'
import { useTxPoster } from '@/src/context/TxPoster'
import { useLiquidityFormsContext } from '@/common/LiquidityForms/LiquidityFormsContext'
import { useAppConstants } from '@/src/context/AppConstants'
import { t } from '@lingui/macro'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { METHODS } from '@/src/services/transactions/const'
import { logAddLiquidity } from '@/src/services/logs'

export const useProvideLiquidity = ({
  coverKey,
  lqValue,
  npmValue,
  liquidityTokenDecimals,
  npmTokenDecimals
}) => {
  const [lqApproving, setLqApproving] = useState(false)
  const [npmApproving, setNPMApproving] = useState(false)
  const [providing, setProviding] = useState(false)

  const { networkId } = useNetwork()
  const { library, account } = useWeb3React()
  const {
    info: {
      vault: vaultTokenAddress,
      vaultTokenSymbol,
      vaultTokenDecimals,
      myStablecoinBalance
    },
    stakingTokenBalance,
    stakingTokenBalanceLoading,
    updateStakingTokenBalance,
    refetchInfo
  } = useLiquidityFormsContext()
  const {
    liquidityTokenAddress,
    NPMTokenAddress,
    liquidityTokenSymbol,
    NPMTokenSymbol
  } = useAppConstants()
  const {
    allowance: lqTokenAllowance,
    approve: lqTokenApprove,
    loading: lqAllowanceLoading,
    refetch: updateLqAllowance
  } = useERC20Allowance(liquidityTokenAddress)
  const {
    allowance: stakeTokenAllowance,
    approve: stakeTokenApprove,
    loading: stakeAllowanceLoading,
    refetch: updateStakeAllowance
  } = useERC20Allowance(NPMTokenAddress)

  const txToast = useTxToast()
  const { writeContract } = useTxPoster()
  const { notifyError } = useErrorNotifier()

  useEffect(() => {
    updateLqAllowance(vaultTokenAddress)
  }, [updateLqAllowance, vaultTokenAddress])

  useEffect(() => {
    updateStakeAllowance(vaultTokenAddress)
  }, [updateStakeAllowance, vaultTokenAddress])

  const handleLqTokenApprove = async () => {
    console.log('handleLqTokenApprove')

    setLqApproving(true)

    const cleanup = () => {
      setLqApproving(false)
    }

    const handleError = (err) => {
      notifyError(err, t`Could not approve DAI`)
    }

    const onTransactionResult = async (tx) => {
      TransactionHistory.push({
        hash: tx.hash,
        methodName: METHODS.LIQUIDITY_PROVIDE_APPROVE,
        status: STATUS.PENDING,
        data: {
          tokenSymbol: liquidityTokenSymbol,
          value: lqValue
        }
      })

      try {
        const tokenSymbol = 'DAI'
        await txToast.push(
          tx,
          {
            pending: t`Approving ${tokenSymbol}`,
            success: t`Approved ${tokenSymbol} Successfully`,
            failure: t`Could not approve ${tokenSymbol}`
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.LIQUIDITY_PROVIDE_APPROVE,
                status: STATUS.SUCCESS,
                data: {
                  tokenSymbol: liquidityTokenSymbol,
                  value: lqValue
                }
              })
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.LIQUIDITY_PROVIDE_APPROVE,
                status: STATUS.FAILED,
                data: {
                  tokenSymbol: liquidityTokenSymbol,
                  value: lqValue
                }
              })
            }
          }
        )
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

    lqTokenApprove(
      vaultTokenAddress,
      convertToUnits(lqValue, liquidityTokenDecimals).toString(),
      {
        onTransactionResult,
        onRetryCancel,
        onError
      }
    )
  }

  const handleNPMTokenApprove = async () => {
    console.log('handleNPMTokenApprove')

    setNPMApproving(true)

    const cleanup = () => {
      setNPMApproving(false)
    }
    const handleError = (err) => {
      notifyError(err, t`Could not approve NPM`)
    }

    const onTransactionResult = async (tx) => {
      TransactionHistory.push({
        hash: tx.hash,
        methodName: METHODS.LIQUIDITY_STAKE_APPROVE,
        status: STATUS.PENDING,
        data: {
          value: npmValue,
          tokenSymbol: NPMTokenSymbol
        }
      })

      try {
        const tokenSymbol = 'NPM'
        await txToast.push(
          tx,
          {
            pending: t`Approving ${tokenSymbol}`,
            success: t`Approved ${tokenSymbol} Successfully`,
            failure: t`Could not approve ${tokenSymbol}`
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.LIQUIDITY_STAKE_APPROVE,
                status: STATUS.SUCCESS,
                data: {
                  tokenSymbol: NPMTokenSymbol,
                  value: npmValue

                }
              })
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.LIQUIDITY_STAKE_APPROVE,
                status: STATUS.FAILED,
                data: {
                  tokenSymbol: NPMTokenSymbol,
                  value: npmValue
                }
              })
            }
          }
        )
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

    stakeTokenApprove(
      vaultTokenAddress,
      convertToUnits(npmValue, npmTokenDecimals).toString(),
      {
        onTransactionResult,
        onRetryCancel,
        onError
      }
    )
  }

  const handleProvide = async (onTxSuccess) => {
    console.log('handleProvide')
    setProviding(true)

    const cleanup = () => {
      setProviding(false)
      updateStakingTokenBalance()
      refetchInfo()
      updateLqAllowance(vaultTokenAddress)
      updateStakeAllowance(vaultTokenAddress)
    }
    const handleError = (err) => {
      notifyError(err, t`Could not add liquidity`)
    }
    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const lqAmount = convertToUnits(
        lqValue,
        liquidityTokenDecimals
      ).toString()
      const npmAmount = convertToUnits(npmValue || '0', npmTokenDecimals).toString()
      const vault = await registry.Vault.getInstance(
        networkId,
        coverKey,
        signerOrProvider
      )

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.LIQUIDITY_PROVIDE,
          status: STATUS.PENDING,
          data: {
            tokenSymbol: vaultTokenSymbol,
            value: lqValue
          }
        })
        await txToast.push(
          tx,
          {
            pending: t`Adding Liquidity`,
            success: t`Added Liquidity Successfully`,
            failure: t`Could not add liquidity`
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.LIQUIDITY_PROVIDE,
                status: STATUS.SUCCESS,
                data: {
                  tokenSymbol: vaultTokenSymbol,
                  value: lqValue
                }
              })
              logAddLiquidity({ account, coverKey, liquidity: lqValue, liquidityCurrency: liquidityTokenSymbol, stake: npmValue, stakeCurrency: NPMTokenSymbol, tx: tx.hash })

              onTxSuccess()
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.LIQUIDITY_PROVIDE,
                status: STATUS.FAILED,
                data: {
                  tokenSymbol: vaultTokenSymbol,
                  value: lqValue
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

      const args = {
        coverKey,
        amount: lqAmount,
        npmStakeToAdd: npmAmount,
        referralCode: utils.keyUtil.toBytes32('')
      }
      writeContract({
        instance: vault,
        methodName: 'addLiquidity',
        onTransactionResult,
        onRetryCancel,
        onError,
        args: [args]
      })
    } catch (err) {
      handleError(err)
      cleanup()
    }
  }

  const hasLqTokenAllowance = isGreaterOrEqual(
    lqTokenAllowance || '0',
    convertToUnits(lqValue || '0', liquidityTokenDecimals)
  )

  const hasNPMTokenAllowance = isGreaterOrEqual(
    stakeTokenAllowance || '0',
    convertToUnits(npmValue || '0', npmTokenDecimals)
  )

  const canProvideLiquidity =
    lqValue &&
    isValidNumber(lqValue) &&
    hasLqTokenAllowance &&
    hasNPMTokenAllowance

  const isError =
    lqValue &&
    (!isValidNumber(lqValue) ||
      isGreater(
        convertToUnits(lqValue || '0', liquidityTokenDecimals),
        myStablecoinBalance || '0'
      ))

  return {
    npmApproving,
    npmBalance: stakingTokenBalance,
    npmBalanceLoading: stakingTokenBalanceLoading,
    hasNPMTokenAllowance,
    npmAllowanceLoading: stakeAllowanceLoading,

    hasLqTokenAllowance,
    lqApproving,
    myStablecoinBalance,
    lqAllowanceLoading,

    canProvideLiquidity,
    isError,
    providing,
    podSymbol: vaultTokenSymbol,
    podAddress: vaultTokenAddress,
    podDecimals: vaultTokenDecimals,

    handleLqTokenApprove,
    handleNPMTokenApprove,
    handleProvide
  }
}
