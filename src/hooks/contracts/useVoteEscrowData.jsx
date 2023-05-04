import {
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import DateLib from '@/lib/date/DateLib'
import { MULTIPLIER } from '@/src/config/constants'
import {
  AvailableContracts,
  getContractInstance
} from '@/src/config/contracts/getContractInstance'
import {
  NpmTokenContractAddresses,
  useAppConstants,
  VoteEscrowContractAddresses
} from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { getActionMessage } from '@/src/helpers/notification'
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
  isGreaterOrEqual,
  isValidNumber,
  toBN
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { useWeb3React } from '@web3-react/core'

const useVoteEscrowData = () => {
  const { library, account } = useWeb3React()

  const { NPMTokenDecimals } = useAppConstants()

  const { networkId } = useNetwork()

  const { balance: npmBalance } = useERC20Balance(NpmTokenContractAddresses[networkId])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const [escrowData, setEscrowData] = useState({
    veNPMBalance: 0,
    boost: 0,
    lockedNPMBalance: 0,
    votingPower: 0,
    unlockTimestamp: 0
  })

  const { notifyError } = useErrorNotifier()

  const { contractRead, writeContract } = useTxPoster()
  const txToast = useTxToast()

  const router = useRouter()

  const {
    allowance,
    loading: loadingAllowance,
    refetch: updateAllowance,
    approve
  } = useERC20Allowance(NpmTokenContractAddresses[networkId])

  useEffect(() => {
    updateAllowance(VoteEscrowContractAddresses[networkId])
  }, [updateAllowance, networkId])

  const canLock = (value) =>
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(allowance, convertToUnits(value || '0'))

  const handleApprove = async (value, durationInWeeks, cb) => {
    setActionLoading(true)

    const cleanup = () => {
      setActionLoading(false)
    }
    const handleError = (err) => {
      notifyError(err, 'Could not approve NPM tokens')
    }

    const onTransactionResult = async (tx) => {
      TransactionHistory.push({
        hash: tx.hash,
        methodName: METHODS.VOTE_ESCROW_APPROVE,
        status: STATUS.PENDING
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
              updateAllowance(VoteEscrowContractAddresses[networkId])
              lock(value, durationInWeeks, cb, true)
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

    approve(VoteEscrowContractAddresses[networkId], convertToUnits(value).toString(), {
      onTransactionResult,
      onRetryCancel,
      onError
    })
  }

  const lock = async (amount, durationInWeeks, cb, skipCheck) => {
    if (!skipCheck && !canLock(amount)) {
      return handleApprove(amount, durationInWeeks, cb)
    }

    setActionLoading(true)

    const cleanup = () => {
      setActionLoading(false)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const instance = getContractInstance(VoteEscrowContractAddresses[networkId], AvailableContracts.VoteEscrowToken, signerOrProvider)

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.VOTE_ESCROW_LOCK,
          status: STATUS.PENDING
        })

        await txToast.push(
          tx,
          {
            pending: getActionMessage(METHODS.VOTE_ESCROW_LOCK, STATUS.PENDING)
              .title,
            success: getActionMessage(METHODS.VOTE_ESCROW_LOCK, STATUS.SUCCESS)
              .title,
            failure: getActionMessage(METHODS.VOTE_ESCROW_LOCK, STATUS.FAILED)
              .title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.VOTE_ESCROW_LOCK,
                status: STATUS.SUCCESS
              })
              getData()
              cleanup()
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.VOTE_ESCROW_LOCK,
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
        notifyError(err, getActionMessage(METHODS.VOTE_ESCROW_LOCK, STATUS.FAILED)
          .title)
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

  const getData = async () => {
    setLoading(true)
    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)

      const instance = getContractInstance(VoteEscrowContractAddresses[networkId], AvailableContracts.VoteEscrowToken, signerOrProvider)

      const unlockTimestamp = await contractRead({
        instance,
        methodName: 'getUnlockTimestamp',
        args: [account]
      })

      const calls = [
        instance.balanceOf(account),
        instance.calculateBoost(parseInt(unlockTimestamp.toString()) - DateLib.unix()),
        instance.getLockedTokenBalance(account),
        instance.getVotingPower(account)
      ]

      const [veNPMBalance, boost, lockedNPMBalance, votingPower] = await Promise.all(calls)

      setEscrowData({
        boost: boost.toString(),
        veNPMBalance: veNPMBalance.toString(),
        lockedNPMBalance: lockedNPMBalance.toString(),
        votingPower: votingPower.toString(),
        unlockTimestamp: unlockTimestamp.toString()
      })
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (account) {
      getData()
    }
    // eslint-disable-next-line
  }, [account])

  return {
    refetch: getData,
    loading,
    data: {
      npmBalance: formatCurrency(convertFromUnits(npmBalance, NPMTokenDecimals), router.locale, 'NPM', true),
      boost: toBN(escrowData.boost).dividedBy(MULTIPLIER),
      veNPMBalance: formatCurrency(convertFromUnits(escrowData.veNPMBalance, NPMTokenDecimals), router.locale, 'NPM', true),
      lockedNPMBalance: formatCurrency(convertFromUnits(escrowData.lockedNPMBalance, NPMTokenDecimals), router.locale, 'NPM', true),
      votingPower: formatCurrency(convertFromUnits(escrowData.votingPower, NPMTokenDecimals), router.locale, 'NPM', true),
      unlockTimestamp: DateLib.toLongDateFormat(escrowData.unlockTimestamp, router.locale)
    },
    lock,
    actionLoading,
    loadingAllowance,
    canLock,
    handleApprove
  }
}

export { useVoteEscrowData }
