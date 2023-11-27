import {
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { NetworkNames } from '@/lib/connect-wallet/config/chains'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import DateLib from '@/lib/date/DateLib'
import { getMonthNames } from '@/lib/dates'
import { DEBOUNCE_TIMEOUT } from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { getActionMessage } from '@/src/helpers/notification'
import { useBondPoolAddress } from '@/src/hooks/contracts/useBondPoolAddress'
import { useDebounce } from '@/src/hooks/useDebounce'
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
  sumOf
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { fromNow } from '@/utils/formatter/relative-time'
import { t } from '@lingui/macro'
import { registry } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

export const useCreateBond = ({ info, refetchBondInfo, value }) => {
  const debouncedValue = useDebounce(value, DEBOUNCE_TIMEOUT)
  const [receiveAmount, setReceiveAmount] = useState('0')
  const [receiveAmountLoading, setReceiveAmountLoading] = useState(false)
  const [approving, setApproving] = useState(false)
  const [bonding, setBonding] = useState(false)
  const [error, setError] = useState('')

  const { networkId } = useNetwork()
  const { account, library } = useWeb3React()
  const { NPMTokenSymbol, NPMTokenDecimals } = useAppConstants()
  const bondContractAddress = useBondPoolAddress()
  const {
    allowance,
    loading: loadingAllowance,
    refetch: updateAllowance,
    approve
  } = useERC20Allowance(info.lpTokenAddress)
  const {
    balance,
    loading: loadingBalance,
    refetch: updateBalance
  } = useERC20Balance(info.lpTokenAddress)

  const txToast = useTxToast()
  const { writeContract, contractRead } = useTxPoster()
  const { notifyError } = useErrorNotifier()
  const router = useRouter()

  const unlockTimestamp = sumOf(DateLib.unix(), info.vestingTerm)
  const unlockTImeFormatted = DateLib.toDateFormat(unlockTimestamp, router.locale)

  useEffect(() => {
    updateAllowance(bondContractAddress)
  }, [bondContractAddress, updateAllowance])

  // Resets loading and other states which are modified in the above hook
  // "IF" condition should match the above effect
  // Should appear after the effect which contains the async function (which sets loading state)
  useEffect(() => {
    if (!networkId || !account || !debouncedValue) {
      if (receiveAmount !== '0') {
        setReceiveAmount('0')
      }
      if (receiveAmountLoading !== false) {
        setReceiveAmountLoading(false)
      }
    }
  }, [account, debouncedValue, networkId, receiveAmount, receiveAmountLoading])

  useEffect(() => {
    let ignore = false
    if (!networkId || !account || !debouncedValue) { return }

    async function updateReceiveAmount () {
      setReceiveAmountLoading(true)

      const cleanup = () => {
        setReceiveAmountLoading(false)
      }
      const handleError = (err) => {
        notifyError(err, t`Could not calculate tokens`)
      }

      try {
        const signerOrProvider = getProviderOrSigner(
          library,
          account,
          networkId
        )
        const instance = await registry.BondPool.getInstance(
          networkId,
          signerOrProvider
        )

        const onError = (err) => {
          handleError(err)
          cleanup()
        }

        const args = [convertToUnits(debouncedValue).toString()]
        const result = await contractRead({
          instance,
          methodName: 'calculateTokensForLp',
          args,
          onError
        })

        if (ignore) { return }
        setReceiveAmount(result.toString())
        cleanup()
      } catch (err) {
        handleError(err)
        cleanup()
      }
    }

    updateReceiveAmount()

    return () => {
      ignore = true
    }
  }, [networkId, debouncedValue, notifyError, account, library, contractRead])

  useEffect(() => {
    if (!value && error) {
      setError('')

      return
    }

    if (!value) {
      return
    }

    if (!isValidNumber(value)) {
      setError(t`Invalid amount to bond`)

      return
    }

    if (isGreater(convertToUnits(value), balance)) {
      setError(t`Insufficient Balance`)

      return
    }

    if (isEqualTo(convertToUnits(value), 0)) {
      setError(t`Please specify a value`)

      return
    }

    if (isGreater(receiveAmount, info.maxBond)) {
      const maxBond = formatCurrency(
        convertFromUnits(info.maxBond).toString(),
        router.locale,
        NPMTokenSymbol,
        true
      ).long

      setError(
        t`Exceeds maximum bond ${
          maxBond
        }`
      )

      return
    }

    if (error) {
      setError('')
    }
  }, [
    balance,
    error,
    info.maxBond,
    receiveAmount,
    router.locale,
    value,
    NPMTokenSymbol
  ])

  const handleApprove = async () => {
    setApproving(true)

    const cleanup = () => {
      setApproving(false)
    }
    const handleError = (err) => {
      notifyError(err, t`Could not approve LP tokens`)
    }

    const onTransactionResult = async (tx) => {
      TransactionHistory.push({
        hash: tx.hash,
        methodName: METHODS.BOND_APPROVE,
        status: STATUS.PENDING,
        data: {
          value,
          receiveAmount,
          tokenSymbol: 'LP'
        }
      })

      await txToast
        .push(
          tx,
          {
            pending: getActionMessage(METHODS.BOND_APPROVE, STATUS.PENDING)
              .title,
            success: getActionMessage(METHODS.BOND_APPROVE, STATUS.SUCCESS)
              .title,
            failure: getActionMessage(METHODS.BOND_APPROVE, STATUS.FAILED)
              .title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.BOND_APPROVE,
                status: STATUS.SUCCESS
              })
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.BOND_APPROVE,
                status: STATUS.FAILED
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

    approve(bondContractAddress, convertToUnits(value).toString(), {
      onTransactionResult,
      onRetryCancel,
      onError
    })
  }

  const handleBond = async (onTxSuccess) => {
    setBonding(true)

    const cleanup = () => {
      setBonding(false)
      updateBalance()
      updateAllowance(bondContractAddress)
      refetchBondInfo()
    }
    const handleError = (err) => {
      notifyError(err, t`Could not create bond`)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)

      const instance = await registry.BondPool.getInstance(
        networkId,
        signerOrProvider
      )

      const onTransactionResult = async (tx) => {
        const logData = {
          network: NetworkNames[networkId],
          networkId,
          account,
          sales: value,
          salesCurrency: info.lpTokenSymbol,
          salesFormatted: formatCurrency(value, router.locale, info.lpTokenSymbol, true).short,
          bond: value,
          bondCurrency: info.lpTokenSymbol,
          bondFormatted: formatCurrency(value, router.locale, info.lpTokenSymbol, true).short,
          allocation: receiveAmount,
          allocationCurrency: NPMTokenSymbol,
          allocationFormatted: formatCurrency(convertFromUnits(receiveAmount, NPMTokenDecimals)).short,
          unlockPeriod: unlockTimestamp.toString(),
          unlockPeriodFormatted: fromNow(unlockTimestamp).replace('in ', ''),
          unlock: unlockTimestamp.toString(),
          unlockMonth: unlockTImeFormatted.split('/')[0],
          unlockMonthformatted: getMonthNames()[unlockTImeFormatted.split('/')[0] - 1],
          unlockYear: unlockTImeFormatted.split('/')[2],
          tx: tx.hash
        }

        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.BOND_CREATE,
          status: STATUS.PENDING,
          data: {
            value,
            receiveAmount,
            tokenSymbol: NPMTokenSymbol,
            logData
          }
        })

        await txToast.push(
          tx,
          {
            pending: getActionMessage(METHODS.BOND_CREATE, STATUS.PENDING)
              .title,
            success: getActionMessage(METHODS.BOND_CREATE, STATUS.SUCCESS)
              .title,
            failure: getActionMessage(METHODS.BOND_CREATE, STATUS.FAILED).title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.BOND_CREATE,
                status: STATUS.SUCCESS
              })

              onTxSuccess()
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.BOND_CREATE,
                status: STATUS.FAILED
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

      const args = [convertToUnits(value).toString(), receiveAmount]
      writeContract({
        instance,
        methodName: 'createBond',
        args,
        onTransactionResult,
        onRetryCancel,
        onError
      })
    } catch (err) {
      handleError(err)
      cleanup()
    }
  }

  const canBond =
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(allowance, convertToUnits(value || '0'))

  return {
    balance,
    loadingBalance,

    receiveAmount,
    receiveAmountLoading,

    approving,
    loadingAllowance,

    bonding,

    canBond,
    error,

    handleApprove,
    handleBond
  }
}
