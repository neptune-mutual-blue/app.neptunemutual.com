import {
  useEffect,
  useMemo,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { abis } from '@/src/config/contracts/abis'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { useActionMessage } from '@/src/helpers/notification'
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
  convertToUnits,
  toBN
} from '@/utils/bn'
import { t } from '@lingui/macro'
import { utils } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'
import { useLingui } from '@lingui/react'

export const useLiquidityGaugePoolDeposit = ({ stakingTokenAddress, stakingTokenDecimals, stakingTokenSymbol, amount, poolAddress }) => {
  const { notifyError } = useErrorNotifier()

  const { networkId } = useNetwork()
  const { account, library } = useWeb3React()

  const [approving, setApproving] = useState(false)
  const [depositing, setDepositing] = useState(false)

  const liquidityGaugePoolAddress = poolAddress

  const {
    allowance,
    approve,
    refetch: updateAllowance,
    loading: loadingAllowance
  } = useERC20Allowance(stakingTokenAddress)

  const { balance, refetch: updateBalance } = useERC20Balance(stakingTokenAddress)

  const txToast = useTxToast()
  const { writeContract } = useTxPoster()

  const { i18n } = useLingui()

  const { getActionMessage } = useActionMessage()

  useEffect(() => {
    updateAllowance(liquidityGaugePoolAddress)
  }, [updateAllowance, liquidityGaugePoolAddress])

  const handleApprove = () => {
    setApproving(true)

    const cleanup = () => {
      setApproving(false)
    }
    const handleError = (err) => {
      notifyError(err, t(i18n)`Could not approve ${stakingTokenSymbol}`)
    }

    const onTransactionResult = async (tx) => {
      TransactionHistory.push({
        hash: tx.hash,
        methodName: METHODS.GAUGE_POOL_TOKEN_APPROVE,
        status: STATUS.PENDING,
        data: {
          value: amount,
          tokenSymbol: stakingTokenSymbol
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

  const handleDeposit = async (onSuccessCallback) => {
    if (!account || !networkId) {
      return
    }

    setDepositing(true)

    const cleanup = () => {
      updateBalance()
      updateAllowance(liquidityGaugePoolAddress)
      setDepositing(false)
    }

    const handleError = (err) => {
      notifyError(err, t(i18n)`Could not lock ${stakingTokenSymbol}`)
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
                onSuccessCallback()
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

      const args = [convertToUnits(amount, stakingTokenDecimals).toString()]
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
  const canApprove = !toBN(amount).isZero() &&
    convertToUnits(amount, stakingTokenDecimals).isLessThanOrEqualTo(balance)
  const canDeposit = !toBN(amount).isZero() &&
    convertToUnits(amount, stakingTokenDecimals).isLessThanOrEqualTo(allowance)

  const error = useMemo(() => {
    if (toBN(amount).isZero()) { return '' }

    if (convertToUnits(amount, stakingTokenDecimals).isGreaterThan(balance)) { return 'Amount exceeds balance' }
  }, [amount, balance, stakingTokenDecimals])

  return {
    handleApprove,
    handleDeposit,

    approving,
    depositing,

    loadingAllowance,

    canApprove,
    canDeposit,

    error
  }
}
