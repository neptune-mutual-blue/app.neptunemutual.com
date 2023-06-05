import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import DateLib from '@/lib/date/DateLib'
import {
  SECONDS_IN_WEEK,
  VOTE_ESCROW_MIN_WEEKS
} from '@/modules/vote-escrow/VoteEscrow'
import {
  CONTRACT_DEPLOYMENTS,
  MULTIPLIER
} from '@/src/config/constants'
import { abis } from '@/src/config/contracts/abis'
import { useAppConstants } from '@/src/context/AppConstants'
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
import { calculateBoost } from '@/utils/calculate-boost'
import { formatCurrency } from '@/utils/formatter/currency'
import { utils } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

const initialData = {
  veNPMBalance: 0,
  lockedNPMBalance: 0,
  unlockTimestamp: '0',
  penalty: '0'
}

export const useVoteEscrowData = () => {
  const { library, account } = useWeb3React()

  const { NPMTokenDecimals, NPMTokenSymbol } = useAppConstants()

  const { networkId } = useNetwork()

  const { balance: npmBalance } = useERC20Balance(CONTRACT_DEPLOYMENTS[networkId].npm)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const [escrowData, setEscrowData] = useState(initialData)

  const { notifyError } = useErrorNotifier()

  const { contractRead, writeContract } = useTxPoster()
  const txToast = useTxToast()

  const router = useRouter()

  const {
    allowance,
    loading: loadingAllowance,
    refetch: updateAllowance,
    approve
  } = useERC20Allowance(CONTRACT_DEPLOYMENTS[networkId].npm)

  const {
    allowance: veNPMAllowance,
    loading: loadingVeNPMAllowance,
    refetch: updateVeNPMAllowance,
    approve: approveVeNPM
  } = useERC20Allowance(CONTRACT_DEPLOYMENTS[networkId].veNPM)

  useEffect(() => {
    updateAllowance(CONTRACT_DEPLOYMENTS[networkId].veNPM)
  }, [updateAllowance, networkId])

  useEffect(() => {
    updateVeNPMAllowance(CONTRACT_DEPLOYMENTS[networkId].veNPM)
  }, [updateVeNPMAllowance, networkId])

  const canLock = (value) =>
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(allowance, convertToUnits(value || '0').toString())

  const hasUnlockAllowance =
    escrowData.veNPMBalance &&
    isValidNumber(escrowData.veNPMBalance) &&
    isGreaterOrEqual(veNPMAllowance, escrowData.veNPMBalance)

  const handleApproveUnlock = async () => {
    setActionLoading(true)

    const cleanup = () => {
      setActionLoading(false)
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
          value: convertFromUnits(escrowData.veNPMBalance.toString(), NPMTokenDecimals),
          tokenSymbol: 'veNPM'
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
              updateVeNPMAllowance(CONTRACT_DEPLOYMENTS[networkId].veNPM)
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

    approveVeNPM(CONTRACT_DEPLOYMENTS[networkId].veNPM, escrowData.veNPMBalance.toString(), {
      onTransactionResult,
      onRetryCancel,
      onError
    })
  }

  const handleApprove = async (value) => {
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
              updateAllowance(CONTRACT_DEPLOYMENTS[networkId].veNPM)
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
      CONTRACT_DEPLOYMENTS[networkId].veNPM, convertToUnits(value).toString(),
      {
        onTransactionResult,
        onRetryCancel,
        onError
      })
  }

  const lock = async (amount, durationInWeeks, cb) => {
    setActionLoading(true)

    const cleanup = () => {
      setActionLoading(false)
    }

    const method = amount > 0 ? METHODS.VOTE_ESCROW_LOCK : METHODS.VOTE_ESCROW_EXTEND

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const instance = utils.contract.getContract(CONTRACT_DEPLOYMENTS[networkId].veNPM, abis.IVoteEscrowToken, signerOrProvider)

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
              getData()
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
        notifyError(err, getActionMessage(method, STATUS.FAILED)
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

  const unlock = async (premature, cb) => {
    setActionLoading(true)

    const cleanup = () => {
      setActionLoading(false)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const instance = utils.contract.getContract(CONTRACT_DEPLOYMENTS[networkId].veNPM, abis.IVoteEscrowToken, signerOrProvider)

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.VOTE_ESCROW_UNLOCK,
          status: STATUS.PENDING,
          data: {
            value: convertFromUnits(escrowData.veNPMBalance, NPMTokenDecimals),
            tokenSymbol: 'veNPM'
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
              getData()
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
        methodName: premature ? 'unlockPrematurely' : 'unlock',
        onTransactionResult,
        onRetryCancel,
        onError
      })
    } catch (err) {
      console.error(err)
    }
  }

  const getData = useCallback(async () => {
    setLoading(true)

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const instance = utils.contract.getContract(CONTRACT_DEPLOYMENTS[networkId].veNPM, abis.IVoteEscrowToken, signerOrProvider)

      const unlockTimestamp = await contractRead({
        instance,
        methodName: '_unlockAt',
        args: [account]
      })

      const calls = [
        instance.balanceOf(account),
        instance._balances(account)
      ]

      const [veNPMBalance, lockedNPMBalance] = await Promise.all(calls)

      setEscrowData({
        veNPMBalance: veNPMBalance.toString(),
        lockedNPMBalance: lockedNPMBalance.toString(),
        unlockTimestamp: unlockTimestamp.toString(),
        penalty: toBN(veNPMBalance).multipliedBy(0.25).toString()
      })
    } catch (err) {
      setEscrowData(initialData)
      console.error(err)
    }

    setLoading(false)
  }, [account, contractRead, library, networkId])

  useEffect(() => {
    if (account) {
      getData()
    }
  }, [account, getData])

  const currentBoostAndVotingPower = useMemo(() => {
    if (escrowData.unlockTimestamp === '0') {
      return {
        boostBN: toBN('1'),
        votingPower: formatCurrency(0, router.locale, NPMTokenSymbol, true)
      }
    }

    const lockedNPMBalanceRaw = escrowData.lockedNPMBalance
    const now = Date.now()
    const unlockDateTimestamp = DateLib.fromUnix(escrowData.unlockTimestamp).getTime()
    const unlockDuration = (unlockDateTimestamp - now) / 1000
    const weeks = Math.ceil(unlockDuration / SECONDS_IN_WEEK)
    const sliderValue = weeks < VOTE_ESCROW_MIN_WEEKS ? VOTE_ESCROW_MIN_WEEKS : weeks
    const newUnlockDate = DateLib.addDays(new Date(), sliderValue * 7)
    const lockedNpmBalance = toBN(lockedNPMBalanceRaw)
    const boostBN = toBN(calculateBoost((newUnlockDate.valueOf() - now) / 1000)).dividedBy(MULTIPLIER)
    const votingPower = formatCurrency(
      convertFromUnits(boostBN.multipliedBy(lockedNpmBalance).toString(), NPMTokenDecimals),
      router.locale,
      NPMTokenSymbol,
      true
    )

    return {
      boostBN,
      votingPower
    }
  }, [NPMTokenDecimals, NPMTokenSymbol, escrowData, router.locale])

  return {
    refetch: getData,
    loading,
    data: {
      npmBalance: formatCurrency(convertFromUnits(npmBalance, NPMTokenDecimals), router.locale, NPMTokenSymbol, true),
      veNPMBalance: formatCurrency(convertFromUnits(escrowData.veNPMBalance, NPMTokenDecimals), router.locale, 'veNPM', true),
      lockedNPMBalanceRaw: escrowData.lockedNPMBalance,
      unlockTimestamp: escrowData.unlockTimestamp,
      penalty: formatCurrency(convertFromUnits(escrowData.penalty, NPMTokenDecimals), router.locale, NPMTokenSymbol, true),
      receivedAfterPenalty: formatCurrency(convertFromUnits(toBN(escrowData.veNPMBalance).minus(escrowData.penalty).toString(), NPMTokenDecimals), router.locale, NPMTokenSymbol, true)
    },
    lock,
    unlock,
    actionLoading,
    loadingAllowance,
    canLock,
    handleApprove,
    loadingVeNPMAllowance,
    hasUnlockAllowance,
    handleApproveUnlock,
    currentBoostAndVotingPower
  }
}
