import {
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { CONTRACT_DEPLOYMENTS } from '@/src/config/constants'
import { abis } from '@/src/config/contracts/abis'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { getActionMessage } from '@/src/helpers/notification'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useTokenDecimals } from '@/src/hooks/useTokenDecimals'
import { useTxToast } from '@/src/hooks/useTxToast'
import { METHODS } from '@/src/services/transactions/const'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import {
  convertToUnits
} from '@/utils/bn'
import { t } from '@lingui/macro'
import { utils } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

export const useLiquidityGaugePoolWithdrawRewards = ({ stakingTokenAddress, amount, poolKey }) => {
  const { notifyError } = useErrorNotifier()

  const { networkId } = useNetwork()
  const { account, library } = useWeb3React()

  const [withdrawingRewards, setWithdrawingRewards] = useState(false)

  const liquidityGaugePoolAddress = CONTRACT_DEPLOYMENTS[networkId]?.liquidityGaugePool
  const stakingTokenDecimals = useTokenDecimals(stakingTokenAddress)

  const txToast = useTxToast()
  const { writeContract } = useTxPoster()

  const handleWithdrawRewards = async () => {
    if (!account || !networkId) {
      return
    }

    setWithdrawingRewards(true)

    const cleanup = () => {
      setWithdrawingRewards(false)
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

  return {
    handleWithdrawRewards,
    withdrawingRewards
  }
}
