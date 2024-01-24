import {
  useMemo,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { abis } from '@/src/config/contracts/abis'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { useActionMessage } from '@/src/helpers/notification'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import {
  useLiquidityGaugePoolStakedAndReward
} from '@/src/hooks/useLiquidityGaugePoolStakedAndReward'
import { useTxToast } from '@/src/hooks/useTxToast'
import { METHODS } from '@/src/services/transactions/const'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import {
  convertFromUnits,
  toBN
} from '@/utils/bn'
import { t } from '@lingui/macro'
import { utils } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'
import { useLingui } from '@lingui/react'

export const useLiquidityGaugePoolWithdraw = ({ isExit, stakingTokenSymbol, stakingTokenDecimals, amountInUnits, poolAddress }) => {
  const { notifyError } = useErrorNotifier()

  const { networkId } = useNetwork()
  const { account, library } = useWeb3React()

  const [withdrawing, setWithdrawing] = useState(false)

  const liquidityGaugePoolAddress = poolAddress

  const { lockedByMe, update } = useLiquidityGaugePoolStakedAndReward({ poolAddress })

  const txToast = useTxToast()
  const { writeContract } = useTxPoster()

  const { i18n } = useLingui()

  const { getActionMessage } = useActionMessage()

  const handleWithdraw = async (onSuccessCallback) => {
    if (isExit) {
      handleExit(onSuccessCallback)

      return
    }

    if (!account || !networkId) {
      return
    }

    setWithdrawing(true)

    const cleanup = () => {
      update()
      setWithdrawing(false)
    }

    const handleError = (err) => {
      notifyError(err, t(i18n)`Could not withdraw rewards`)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const instance = utils.contract.getContract(liquidityGaugePoolAddress, abis.LiquidityGaugePool, signerOrProvider)

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.GAUGE_POOL_WITHDRAW,
          status: STATUS.PENDING,
          data: { value: convertFromUnits(amountInUnits, stakingTokenDecimals).toString(), tokenSymbol: stakingTokenSymbol }
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
                onSuccessCallback()
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

      writeContract({
        instance,
        methodName: 'withdraw',
        onTransactionResult,
        onRetryCancel,
        onError,
        args: [amountInUnits]
      })
    } catch (err) {
      handleError(err)
      cleanup()
    }
  }

  const handleExit = async (onSuccessCallback) => {
    if (!account || !networkId) {
      return
    }

    setWithdrawing(true)

    const cleanup = () => {
      update()
      setWithdrawing(false)
    }

    const handleError = (err) => {
      notifyError(err, t(i18n)`Could not withdraw rewards`)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const instance = utils.contract.getContract(liquidityGaugePoolAddress, abis.LiquidityGaugePool, signerOrProvider)

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.GAUGE_POOL_WITHDRAW,
          status: STATUS.PENDING,
          data: { value: convertFromUnits(amountInUnits, stakingTokenDecimals).toString(), tokenSymbol: stakingTokenSymbol }
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
                onSuccessCallback()
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

      writeContract({
        instance,
        methodName: 'exit',
        onTransactionResult,
        onRetryCancel,
        onError
      })
    } catch (err) {
      handleError(err)
      cleanup()
    }
  }

  const canWithdraw = !toBN(amountInUnits).isZero() &&
    toBN(amountInUnits).isLessThanOrEqualTo(lockedByMe)

  const error = useMemo(() => {
    if (toBN(amountInUnits).isZero()) {
      return ''
    }

    if (toBN(amountInUnits).isGreaterThan(lockedByMe)) {
      return 'Amount exceeds locked balance'
    }
  }, [amountInUnits, lockedByMe])

  return {
    handleWithdraw,
    handleExit,
    withdrawing,
    canWithdraw,
    error
  }
}
