import {
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { NetworkNames } from '@/lib/connect-wallet/config/chains'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { useActionMessage } from '@/src/helpers/notification'
import {
  useStakingPoolsAddress
} from '@/src/hooks/contracts/useStakingPoolsAddress'
import { useERC20Allowance } from '@/src/hooks/useERC20Allowance'
import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useTxToast } from '@/src/hooks/useTxToast'
import { METHODS } from '@/src/services/transactions/const'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import {
  convertFromUnits,
  convertToUnits,
  isEqualTo,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
  sort,
  toBN
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { explainInterval } from '@/utils/formatter/interval'
import {
  config,
  registry
} from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

export const useStakingPoolDeposit = ({
  value,
  poolKey,
  tokenAddress,
  tokenSymbol,
  maximumStake,
  refetchInfo,
  info
}) => {
  const [error, setError] = useState('')
  const [approving, setApproving] = useState(false)
  const [depositing, setDepositing] = useState(false)

  const { networkId } = useNetwork()
  const { account, library } = useWeb3React()
  const poolContractAddress = useStakingPoolsAddress()
  const {
    allowance,
    approve,
    refetch: updateAllowance,
    loading: loadingAllowance
  } = useERC20Allowance(tokenAddress)
  const {
    balance,
    refetch: updateBalance,
    loading: loadingBalance
  } = useERC20Balance(tokenAddress)

  const txToast = useTxToast()
  const { writeContract } = useTxPoster()
  const { notifyError } = useErrorNotifier()
  const router = useRouter()

  const { getActionMessage } = useActionMessage()

  // Minimum of info.maximumStake, balance
  const maxStakableAmount = sort([maximumStake, balance])[0]

  const approxBlockTime =
    config.networks.getChainConfig(networkId).approximateBlockTime
  const lockupPeriod = toBN(info?.lockupPeriodInBlocks).multipliedBy(
    approxBlockTime
  )

  const withdrawStartHeight = info?.canWithdrawFromBlockHeight

  useEffect(() => {
    updateAllowance(poolContractAddress)
  }, [poolContractAddress, updateAllowance])

  const handleApprove = async () => {
    setApproving(true)

    const cleanup = () => {
      setApproving(false)
    }
    const handleError = (err) => {
      notifyError(err, `Could not approve ${tokenSymbol}`)
    }

    const onTransactionResult = async (tx) => {
      TransactionHistory.push({
        hash: tx.hash,
        methodName: METHODS.STAKING_DEPOSIT_TOKEN_APPROVE,
        status: STATUS.PENDING,
        data: {
          value,
          tokenSymbol
        }
      })

      try {
        await txToast.push(
          tx,
          {
            pending: getActionMessage(
              METHODS.STAKING_DEPOSIT_TOKEN_APPROVE,
              STATUS.PENDING,
              {
                value,
                tokenSymbol
              }
            ).title,
            success: getActionMessage(
              METHODS.STAKING_DEPOSIT_TOKEN_APPROVE,
              STATUS.SUCCESS,
              {
                value,
                tokenSymbol
              }
            ).title,
            failure: getActionMessage(
              METHODS.STAKING_DEPOSIT_TOKEN_APPROVE,
              STATUS.FAILED,
              {
                value,
                tokenSymbol
              }
            ).title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.STAKING_DEPOSIT_TOKEN_APPROVE,
                status: STATUS.SUCCESS
              })
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.STAKING_DEPOSIT_TOKEN_APPROVE,
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

    approve(poolContractAddress, convertToUnits(value).toString(), {
      onTransactionResult,
      onRetryCancel,
      onError
    })
  }

  const handleDeposit = async (onDepositSuccess) => {
    if (!account || !networkId) {
      return
    }

    setDepositing(true)

    const cleanup = () => {
      updateBalance()
      updateAllowance(poolContractAddress)
      refetchInfo()
      setDepositing(false)
    }

    const handleError = (err) => {
      notifyError(err, `Could not stake ${tokenSymbol}`)
    }

    const signerOrProvider = getProviderOrSigner(library, account, networkId)

    try {
      const instance = await registry.StakingPools.getInstance(
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
          type: info.myStake === 0 ? 'enter' : 'add',
          poolKey,
          poolName: info.name,
          stake: value,
          stakeCurrency: tokenSymbol,
          stakeFormatted: formatCurrency(value, router.locale, tokenSymbol, true).short,
          lockupPeriod,
          lockupPeriodFormatted: explainInterval(lockupPeriod),
          withdrawStartHeight
        }

        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.STAKING_DEPOSIT_COMPLETE,
          status: STATUS.PENDING,
          data: { value, tokenSymbol, logData }
        })

        await txToast
          .push(
            tx,
            {
              pending: getActionMessage(
                METHODS.STAKING_DEPOSIT_COMPLETE,
                STATUS.PENDING,
                {
                  value,
                  tokenSymbol
                }
              ).title,
              success: getActionMessage(
                METHODS.STAKING_DEPOSIT_COMPLETE,
                STATUS.SUCCESS,
                {
                  value,
                  tokenSymbol
                }
              ).title,
              failure: getActionMessage(
                METHODS.STAKING_DEPOSIT_COMPLETE,
                STATUS.FAILED,
                {
                  value,
                  tokenSymbol
                }
              ).title
            },
            {
              onTxSuccess: () => {
                onDepositSuccess()
                TransactionHistory.push({
                  hash: tx.hash,
                  methodName: METHODS.STAKING_DEPOSIT_COMPLETE,
                  status: STATUS.SUCCESS
                })
              },
              onTxFailure: () => {
                TransactionHistory.push({
                  hash: tx.hash,
                  methodName: METHODS.STAKING_DEPOSIT_COMPLETE,
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

      const args = [poolKey, convertToUnits(value).toString()]
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

  useEffect(() => {
    if (!value && error) {
      setError('')

      return
    }

    if (!value) {
      return
    }

    if (!isValidNumber(value)) {
      setError('Invalid amount to stake')

      return
    }

    if (!account) {
      setError('Please connect your wallet')

      return
    }

    if (isEqualTo(value, '0')) {
      setError('Please specify an amount')

      return
    }

    if (isGreater(convertToUnits(value).toString(), balance)) {
      setError('Insufficient Balance')

      return
    }

    if (isGreater(convertToUnits(value).toString(), maxStakableAmount)) {
      const maxStakableTokenAmount = formatCurrency(
        convertFromUnits(maxStakableAmount).toString(),
        router.locale,
        '',
        true
      ).short

      setError(`Cannot stake more than ${maxStakableTokenAmount}`)

      return
    }

    if (error) {
      setError('')
    }
  }, [account, balance, error, maxStakableAmount, router.locale, value])

  const canDeposit =
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(allowance, convertToUnits(value || '0'))

  const isError = value && (!isValidNumber(value) || error)

  return {
    balance,
    loadingBalance,

    maxStakableAmount,

    isError,
    errorMsg: error,

    approving,
    loadingAllowance,

    depositing,

    canDeposit,

    handleApprove,
    handleDeposit
  }
}
