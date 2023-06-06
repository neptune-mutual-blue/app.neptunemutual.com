import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { CONTRACT_DEPLOYMENTS } from '@/src/config/constants'
import { abis } from '@/src/config/contracts/abis'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { getActionMessage } from '@/src/helpers/notification'
import { useERC20Allowance } from '@/src/hooks/useERC20Allowance'
import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useTokenDecimals } from '@/src/hooks/useTokenDecimals'
import { useTokenSymbol } from '@/src/hooks/useTokenSymbol'
import { useTxToast } from '@/src/hooks/useTxToast'
import { contractRead } from '@/src/services/readContract'
import { METHODS } from '@/src/services/transactions/const'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import {
  convertToUnits,
  toBN
} from '@/utils/bn'
import { t } from '@lingui/macro'
import { utils } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

export const useLiquidityGaugePoolActions = ({ stakingTokenAddress, amount, poolKey }) => {
  const { notifyError } = useErrorNotifier()

  const { networkId } = useNetwork()
  const { account, library } = useWeb3React()

  const [approving, setApproving] = useState(false)
  const [processingTx, setProcessingTx] = useState(false)

  const liquidityGaugePoolAddress = CONTRACT_DEPLOYMENTS[networkId].liquidityGaugePool
  const stakingTokenSymbol = useTokenSymbol(stakingTokenAddress)
  const stakingTokenDecimals = useTokenDecimals(stakingTokenAddress)

  const [poolStaked, setPoolStaked] = useState('0')
  const [rewardAmount, setRewardAmount] = useState('0')

  const {
    allowance,
    approve,
    refetch: updateAllowance
    // loading: loadingAllowance
  } = useERC20Allowance(stakingTokenAddress)

  const { balance, refetch: updateBalance } = useERC20Balance(stakingTokenAddress)

  const txToast = useTxToast()
  const { writeContract } = useTxPoster()

  useEffect(() => {
    updateAllowance(liquidityGaugePoolAddress)
  }, [updateAllowance, liquidityGaugePoolAddress])

  const fetchStakedAndReward = useCallback(async () => {
    if (!networkId || !account || !poolKey) return

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const instance = utils.contract.getContract(liquidityGaugePoolAddress, abis.LiquidityGaugePool, signerOrProvider)

      const args = [poolKey, account]
      const calls = [
        contractRead({
          instance,
          methodName: '_poolStakedByMe',
          args
        }),
        contractRead({
          instance,
          methodName: 'calculateReward',
          args
        })
      ]
      const [staked, reward] = await Promise.all(calls)
      setPoolStaked(staked.toString())
      setRewardAmount(reward.toString())
    } catch (error) {
      console.error('Error in getting staked pool amount & reward', error)
    }
  }, [account, library, liquidityGaugePoolAddress, networkId, poolKey])

  useEffect(() => {
    fetchStakedAndReward()
  }, [fetchStakedAndReward])

  const handleApprove = () => {
    setApproving(true)

    const cleanup = () => {
      setApproving(false)
    }
    const handleError = (err) => {
      notifyError(err, t`Could not approve ${stakingTokenSymbol}`)
    }

    const onTransactionResult = async (tx) => {
      TransactionHistory.push({
        hash: tx.hash,
        methodName: METHODS.GAUGE_POOL_TOKEN_APPROVE,
        status: STATUS.PENDING,
        data: {
          value: amount,
          stakingTokenSymbol
        }
      })

      try {
        await txToast.push(
          tx,
          {
            pending: getActionMessage(
              METHODS.GAUGE_POOL_TOKEN_APPROVE,
              STATUS.PENDING
            ).title,
            success: getActionMessage(
              METHODS.GAUGE_POOL_TOKEN_APPROVE,
              STATUS.SUCCESS
            ).title,
            failure: getActionMessage(
              METHODS.GAUGE_POOL_TOKEN_APPROVE,
              STATUS.FAILED
            ).title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.GAUGE_POOL_TOKEN_APPROVE,
                status: STATUS.SUCCESS
              })
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.GAUGE_POOL_TOKEN_APPROVE,
                status: STATUS.FAILED
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

    approve(liquidityGaugePoolAddress, convertToUnits(amount, stakingTokenDecimals).toString(), {
      onTransactionResult,
      onRetryCancel,
      onError
    })
  }

  const handleDeposit = async () => {
    if (!account || !networkId) {
      return
    }

    setProcessingTx(true)

    const cleanup = () => {
      updateBalance()
      updateAllowance(liquidityGaugePoolAddress)
      setProcessingTx(false)
    }

    const handleError = (err) => {
      notifyError(err, t`Could not lock ${stakingTokenSymbol}`)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const instance = utils.contract.getContract(
        liquidityGaugePoolAddress,
        abis.LiquidityGaugePool,
        signerOrProvider
      )

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.GAUGE_POOL_DEPOSIT,
          status: STATUS.PENDING,
          data: { value: amount, tokenSymbol: stakingTokenSymbol }
        })

        await txToast
          .push(
            tx,
            {
              pending: getActionMessage(
                METHODS.GAUGE_POOL_DEPOSIT,
                STATUS.PENDING
              ).title,
              success: getActionMessage(
                METHODS.GAUGE_POOL_DEPOSIT,
                STATUS.SUCCESS
              ).title,
              failure: getActionMessage(
                METHODS.GAUGE_POOL_DEPOSIT,
                STATUS.FAILED
              ).title
            },
            {
              onTxSuccess: () => {
                TransactionHistory.push({
                  hash: tx.hash,
                  methodName: METHODS.GAUGE_POOL_DEPOSIT,
                  status: STATUS.SUCCESS
                })
              },
              onTxFailure: () => {
                TransactionHistory.push({
                  hash: tx.hash,
                  methodName: METHODS.GAUGE_POOL_DEPOSIT,
                  status: STATUS.SUCCESS
                })
              }
            }
          )
          .catch((err) => {
            handleError(err)
          })

        cleanup()
      }

      const onRetryCancel = () => {
        cleanup()
      }

      const onError = (err) => {
        handleError(err)
        cleanup()
      }

      const args = [poolKey, convertToUnits(amount, stakingTokenDecimals).toString()]
      writeContract({
        instance,
        methodName: 'deposit',
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

  const handleWithdraw = async () => {
    if (!account || !networkId) {
      return
    }

    setProcessingTx(true)

    const cleanup = () => {
      updateBalance()
      updateAllowance(liquidityGaugePoolAddress)
      setProcessingTx(false)
    }

    const handleError = (err) => {
      notifyError(err, t`Could not withdraw rewards`)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const instance = utils.contract.getContract(liquidityGaugePoolAddress, abis.LiquidityGaugePool, signerOrProvider)

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.GAUGE_POOL_WITHDRAW,
          status: STATUS.PENDING,
          data: { value: amount, tokenSymbol: stakingTokenSymbol }
        })

        await txToast
          .push(
            tx,
            {
              pending: getActionMessage(
                METHODS.GAUGE_POOL_WITHDRAW,
                STATUS.PENDING
              ).title,
              success: getActionMessage(
                METHODS.GAUGE_POOL_WITHDRAW,
                STATUS.SUCCESS
              ).title,
              failure: getActionMessage(
                METHODS.GAUGE_POOL_WITHDRAW,
                STATUS.FAILED
              ).title
            },
            {
              onTxSuccess: () => {
                TransactionHistory.push({
                  hash: tx.hash,
                  methodName: METHODS.GAUGE_POOL_WITHDRAW,
                  status: STATUS.SUCCESS
                })
              },
              onTxFailure: () => {
                TransactionHistory.push({
                  hash: tx.hash,
                  methodName: METHODS.GAUGE_POOL_WITHDRAW,
                  status: STATUS.SUCCESS
                })
              }
            }
          )
          .catch((err) => {
            handleError(err)
          })

        cleanup()
      }

      const onRetryCancel = () => {
        cleanup()
      }

      const onError = (err) => {
        handleError(err)
        cleanup()
      }

      const args = [poolKey, convertToUnits(amount, stakingTokenDecimals).toString()]
      writeContract({
        instance,
        methodName: 'withdraw',
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

  const handleWithdrawRewards = async () => {
    if (!account || !networkId) {
      return
    }

    setProcessingTx(true)

    const cleanup = () => {
      updateBalance()
      updateAllowance(liquidityGaugePoolAddress)
      setProcessingTx(false)
    }

    const handleError = (err) => {
      notifyError(err, t`Could not withdraw rewards`)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const instance = utils.contract.getContract(liquidityGaugePoolAddress, abis.LiquidityGaugePool, signerOrProvider)

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.GAUGE_POOL_WITHDRAW_REWARDS,
          status: STATUS.PENDING
          // data: { value: amount, tokenSymbol: stakingTokenSymbol }
        })

        await txToast
          .push(
            tx,
            {
              pending: getActionMessage(
                METHODS.GAUGE_POOL_WITHDRAW_REWARDS,
                STATUS.PENDING
              ).title,
              success: getActionMessage(
                METHODS.GAUGE_POOL_WITHDRAW_REWARDS,
                STATUS.SUCCESS
              ).title,
              failure: getActionMessage(
                METHODS.GAUGE_POOL_WITHDRAW_REWARDS,
                STATUS.FAILED
              ).title
            },
            {
              onTxSuccess: () => {
                TransactionHistory.push({
                  hash: tx.hash,
                  methodName: METHODS.GAUGE_POOL_WITHDRAW_REWARDS,
                  status: STATUS.SUCCESS
                })
              },
              onTxFailure: () => {
                TransactionHistory.push({
                  hash: tx.hash,
                  methodName: METHODS.GAUGE_POOL_WITHDRAW_REWARDS,
                  status: STATUS.SUCCESS
                })
              }
            }
          )
          .catch((err) => {
            handleError(err)
          })

        cleanup()
      }

      const onRetryCancel = () => {
        cleanup()
      }

      const onError = (err) => {
        handleError(err)
        cleanup()
      }

      const args = [poolKey, convertToUnits(amount, stakingTokenDecimals).toString()]
      writeContract({
        instance,
        methodName: 'withdrawRewards',
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

  const canApprove = !toBN(amount).isZero() &&
    convertToUnits(amount, stakingTokenDecimals).isLessThanOrEqualTo(balance)
  const canSpend = !toBN(amount).isZero() &&
    convertToUnits(amount, stakingTokenDecimals).isLessThanOrEqualTo(allowance)

  return {
    handleApprove,
    handleDeposit,
    handleWithdraw,
    handleWithdrawRewards,

    approving,
    processingTx,

    canApprove,
    canSpend,

    balance,
    poolStaked,
    rewardAmount
  }
}
