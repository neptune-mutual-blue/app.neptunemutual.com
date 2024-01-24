import {
  useEffect,
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
  isGreaterOrEqual
} from '@/utils/bn'
import { utils } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

export const useVoteEscrowLock = ({ refetchLockData, lockAmountInUnits, NPMTokenSymbol, NPMTokenAddress, veNPMTokenAddress }) => {
  const { library, account } = useWeb3React()

  const { networkId } = useNetwork()
  const { balance: npmBalance, loading: loadingBalance } = useERC20Balance(NPMTokenAddress)

  const { writeContract } = useTxPoster()
  const { notifyError } = useErrorNotifier()
  const txToast = useTxToast()

  const {
    allowance,
    loading: loadingAllowance,
    refetch: updateAllowance,
    approve
  } = useERC20Allowance(NPMTokenAddress)
  const [approving, setApproving] = useState(false)
  const [locking, setLocking] = useState(false)

  const { getActionMessage } = useActionMessage()

  useEffect(() => {
    updateAllowance(veNPMTokenAddress)
  }, [updateAllowance, veNPMTokenAddress])

  const handleApprove = async (value) => {
    setApproving(true)

    const cleanup = () => {
      setApproving(false)
    }
    const handleError = (err) => {
      notifyError(err, 'Could not approve NPM tokens')
    }

    const onTransactionResult = async (tx) => {
      TransactionHistory.push({
        hash: tx.hash,
        methodName: METHODS.VOTE_ESCROW_APPROVE,
        status: STATUS.PENDING,
        data: {
          value,
          tokenSymbol: NPMTokenSymbol
        }
      })

      await txToast
        .push(
          tx,
          {
            pending: getActionMessage(METHODS.VOTE_ESCROW_APPROVE, STATUS.PENDING)
              .title,
            success: getActionMessage(METHODS.VOTE_ESCROW_APPROVE, STATUS.SUCCESS)
              .title,
            failure: getActionMessage(METHODS.VOTE_ESCROW_APPROVE, STATUS.FAILED)
              .title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.VOTE_ESCROW_APPROVE,
                status: STATUS.SUCCESS
              })
              updateAllowance(veNPMTokenAddress)
            },
            onTxFailure: (err) => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.VOTE_ESCROW_APPROVE,
                status: STATUS.FAILED
              })
              handleError(err)
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

    approve(
      veNPMTokenAddress, lockAmountInUnits,
      {
        onTransactionResult,
        onRetryCancel,
        onError
      })
  }

  const lock = async (amount, durationInWeeks, cb) => {
    setLocking(true)

    const cleanup = () => {
      setLocking(false)
    }

    const method = amount > 0 ? METHODS.VOTE_ESCROW_LOCK : METHODS.VOTE_ESCROW_EXTEND

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const instance = utils.contract.getContract(veNPMTokenAddress, abis.IVoteEscrowToken, signerOrProvider)

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: method,
          status: STATUS.PENDING,
          data: {
            value: amount,
            tokenSymbol: NPMTokenSymbol
          }
        })

        await txToast.push(
          tx,
          {
            pending: getActionMessage(method, STATUS.PENDING)
              .title,
            success: getActionMessage(method, STATUS.SUCCESS)
              .title,
            failure: getActionMessage(method, STATUS.FAILED)
              .title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: method,
                status: STATUS.SUCCESS
              })
              cb()
              refetchLockData()
              cleanup()
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: method,
                status: STATUS.FAILED
              })
              cleanup()
            }
          }
        )
      }

      const onRetryCancel = () => {
        cleanup()
      }

      const onError = (err) => {
        notifyError(
          err,
          getActionMessage(method, STATUS.FAILED).title
        )
        cleanup()
      }

      const args = [convertToUnits(amount).toString(), durationInWeeks]
      writeContract({
        instance,
        methodName: 'lock',
        args,
        onTransactionResult,
        onRetryCancel,
        onError
      })
    } catch (err) {
      console.error(err)
    }
  }

  const canLock = isGreaterOrEqual(allowance, lockAmountInUnits)

  return {
    data: {
      npmBalance
    },
    lock,
    approving,
    locking,
    loadingAllowance,
    loadingBalance,
    canLock,
    handleApprove
  }
}
