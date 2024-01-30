import {
  useEffect,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import DateLib from '@/lib/date/DateLib'
import { abis } from '@/src/config/contracts/abis'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { useActionMessage } from '@/src/helpers/notification'
import { useERC20Allowance } from '@/src/hooks/useERC20Allowance'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useTxToast } from '@/src/hooks/useTxToast'
import { METHODS } from '@/src/services/transactions/const'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import {
  convertFromUnits,
  isGreaterOrEqual,
  isValidNumber,
  toBN
} from '@/utils/bn'
import { utils } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

export const useVoteEscrowUnlock = ({
  refetchLockData,
  veNPMBalance,
  veNPMTokenAddress,
  veNPMTokenSymbol,
  veNPMTokenDecimals,
  unlockTimestamp
}) => {
  const { library, account } = useWeb3React()

  const { networkId } = useNetwork()

  const { writeContract } = useTxPoster()
  const { notifyError } = useErrorNotifier()
  const txToast = useTxToast()

  const {
    allowance: veNPMAllowance,
    loading: loadingAllowance,
    refetch: updateVeNPMAllowance,
    approve: approveVeNPM
  } = useERC20Allowance(veNPMTokenAddress)
  const [approving, setApproving] = useState(false)
  const [unlocking, setUnlocking] = useState(false)

  const { getActionMessage } = useActionMessage()

  useEffect(() => {
    updateVeNPMAllowance(veNPMTokenAddress)
  }, [updateVeNPMAllowance, veNPMTokenAddress])

  const isPrematureUnlock = toBN(unlockTimestamp).isGreaterThan(DateLib.unix())

  const hasAllowance =
    veNPMBalance &&
    isValidNumber(veNPMBalance) &&
    isGreaterOrEqual(veNPMAllowance, veNPMBalance)

  const handleApprove = async () => {
    setApproving(true)

    const cleanup = () => {
      setApproving(false)
    }
    const handleError = (err) => {
      notifyError(err, 'Could not approve veNPM tokens')
    }

    const onTransactionResult = async (tx) => {
      TransactionHistory.push({
        hash: tx.hash,
        methodName: METHODS.VOTE_ESCROW_UNLOCK_APPROVE,
        status: STATUS.PENDING,
        data: {
          value: convertFromUnits(veNPMBalance.toString(), veNPMTokenDecimals),
          tokenSymbol: veNPMTokenSymbol
        }
      })

      await txToast
        .push(
          tx,
          {
            pending: getActionMessage(METHODS.VOTE_ESCROW_UNLOCK_APPROVE, STATUS.PENDING)
              .title,
            success: getActionMessage(METHODS.VOTE_ESCROW_UNLOCK_APPROVE, STATUS.SUCCESS)
              .title,
            failure: getActionMessage(METHODS.VOTE_ESCROW_UNLOCK_APPROVE, STATUS.FAILED)
              .title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.VOTE_ESCROW_UNLOCK_APPROVE,
                status: STATUS.SUCCESS
              })
              updateVeNPMAllowance(veNPMTokenAddress)
            },
            onTxFailure: (err) => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.VOTE_ESCROW_UNLOCK_APPROVE,
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

    approveVeNPM(veNPMTokenAddress, veNPMBalance, {
      onTransactionResult,
      onRetryCancel,
      onError
    })
  }

  const unlock = async (cb) => {
    setUnlocking(true)

    const cleanup = () => {
      setUnlocking(false)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const instance = utils.contract.getContract(veNPMTokenAddress, abis.IVoteEscrowToken, signerOrProvider)

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.VOTE_ESCROW_UNLOCK,
          status: STATUS.PENDING,
          data: {
            value: convertFromUnits(veNPMBalance, veNPMTokenDecimals),
            tokenSymbol: veNPMTokenSymbol
          }
        })

        await txToast.push(
          tx,
          {
            pending: getActionMessage(METHODS.VOTE_ESCROW_UNLOCK, STATUS.PENDING)
              .title,
            success: getActionMessage(METHODS.VOTE_ESCROW_UNLOCK, STATUS.SUCCESS)
              .title,
            failure: getActionMessage(METHODS.VOTE_ESCROW_UNLOCK, STATUS.FAILED)
              .title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.VOTE_ESCROW_UNLOCK,
                status: STATUS.SUCCESS
              })
              cb()
              refetchLockData()
              cleanup()
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.VOTE_ESCROW_UNLOCK,
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
        notifyError(err, getActionMessage(METHODS.VOTE_ESCROW_UNLOCK, STATUS.FAILED)
          .title)
        cleanup()
      }

      writeContract({
        instance,
        methodName: isPrematureUnlock ? 'unlockPrematurely' : 'unlock',
        onTransactionResult,
        onRetryCancel,
        onError
      })
    } catch (err) {
      console.error(err)
    }
  }

  return {
    unlock,
    approving,
    unlocking,
    loadingAllowance,
    handleApprove,
    hasAllowance,
    isPrematureUnlock
  }
}
