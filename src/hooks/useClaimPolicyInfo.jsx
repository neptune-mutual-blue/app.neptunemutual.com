import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useNetwork } from '@/src/context/Network'
import { useAuthValidation } from '@/src/hooks/useAuthValidation'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useTxToast } from '@/src/hooks/useTxToast'
import {
  convertFromUnits,
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
  toBN
} from '@/utils/bn'
import { registry } from '@neptunemutual/sdk'

import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { useERC20Allowance } from '@/src/hooks/useERC20Allowance'
import { useClaimsProcessorAddress } from '@/src/hooks/contracts/useClaimsProcessorAddress'
import { useTxPoster } from '@/src/context/TxPoster'
import { useCxTokenRowContext } from '@/src/modules/my-policies/CxTokenRowContext'
import { MULTIPLIER } from '@/src/config/constants'
import { t } from '@lingui/macro'
import { useAppConstants } from '@/src/context/AppConstants'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { METHODS } from '@/src/services/transactions/const'
import { getActionMessage } from '@/src/helpers/notification'
import { analyticsLogger } from '@/utils/logger'
import { logClaimCover } from '@/src/services/logs'
import { NetworkNames } from '@/lib/connect-wallet/config/chains'
import { safeParseBytes32String } from '@/utils/formatter/bytes32String'
import { formatCurrency } from '@/utils/formatter/currency'
import { useRouter } from 'next/router'
import { formatPercent } from '@/utils/formatter/percent'

export const useClaimPolicyInfo = ({
  value,
  cxTokenAddress,
  cxTokenDecimals,
  cxTokenSymbol,
  coverKey,
  productKey,
  incidentDate,
  claimPlatformFee,
  tokenSymbol
}) => {
  const router = useRouter()
  const [approving, setApproving] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [receiveAmount, setReceiveAmount] = useState('0')
  const [error, setError] = useState('')

  const { liquidityTokenDecimals } = useAppConstants()
  const { account, library } = useWeb3React()
  const { networkId } = useNetwork()
  const claimsProcessorAddress = useClaimsProcessorAddress()
  const { balance, refetchBalance } = useCxTokenRowContext()
  const {
    allowance,
    loading: loadingAllowance,
    refetch: updateAllowance,
    approve
  } = useERC20Allowance(cxTokenAddress)

  const txToast = useTxToast()
  const { writeContract } = useTxPoster()
  const { requiresAuth } = useAuthValidation()
  const { notifyError } = useErrorNotifier()

  useEffect(() => {
    updateAllowance(claimsProcessorAddress)
  }, [claimsProcessorAddress, updateAllowance])

  // Update receive amount
  useEffect(() => {
    if (!value) return

    const cxTokenAmount = convertToUnits(value).toString()

    // cxTokenAmount * claimPlatformFee / MULTIPLIER
    const platformFeeAmount = toBN(cxTokenAmount)
      .multipliedBy(claimPlatformFee)
      .dividedBy(MULTIPLIER)

    // cxTokenAmount - platformFeeAmount
    const claimAmount = convertToUnits(
      convertFromUnits(
        toBN(cxTokenAmount).minus(platformFeeAmount),
        cxTokenDecimals
      ),
      liquidityTokenDecimals
    ).toString()

    setReceiveAmount(claimAmount)
  }, [claimPlatformFee, cxTokenDecimals, liquidityTokenDecimals, value])

  // RESET STATE
  useEffect(() => {
    if (!value && receiveAmount !== '0') {
      setReceiveAmount('0')
    }
  }, [receiveAmount, value])

  const handleApprove = async () => {
    if (!networkId || !account || !cxTokenAddress) {
      requiresAuth()
      return
    }

    setApproving(true)
    const cleanup = () => {
      setApproving(false)
    }
    const handleError = (err) => {
      notifyError(err, t`Could not approve ${tokenSymbol} tokens`)
    }

    const onTransactionResult = async (tx) => {
      TransactionHistory.push({
        hash: tx.hash,
        methodName: METHODS.CLAIM_COVER_APPROVE,
        status: STATUS.PENDING,
        data: {
          value,
          receiveAmount,
          tokenSymbol
        }
      })

      try {
        await txToast.push(
          tx,
          {
            pending: getActionMessage(
              METHODS.CLAIM_COVER_APPROVE,
              STATUS.PENDING,
              {
                value,
                tokenSymbol
              }
            ).title,
            success: getActionMessage(
              METHODS.CLAIM_COVER_APPROVE,
              STATUS.SUCCESS,
              {
                value,
                tokenSymbol
              }
            ).title,
            failure: getActionMessage(
              METHODS.CLAIM_COVER_APPROVE,
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
                methodName: METHODS.CLAIM_COVER_APPROVE,
                status: STATUS.SUCCESS
              })
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.CLAIM_COVER_APPROVE,
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

    approve(claimsProcessorAddress, convertToUnits(value).toString(), {
      onTransactionResult,
      onRetryCancel,
      onError
    })
  }

  const handleClaim = async (onTxSuccess) => {
    if (!networkId || !account || !cxTokenAddress) {
      requiresAuth()
      return
    }

    setClaiming(true)

    const cleanup = () => {
      updateAllowance(claimsProcessorAddress)
      setClaiming(false)
    }

    const handleError = (err) => {
      notifyError(err, t`Could not claim policy`)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)

      const instance = await registry.ClaimsProcessor.getInstance(
        networkId,
        signerOrProvider
      )

      const onTransactionResult = async (tx) => {
        const logData = {
          network: NetworkNames[networkId],
          networkId,
          coverKey,
          coverName: safeParseBytes32String(coverKey),
          productKey,
          productName: safeParseBytes32String(productKey),
          cost: receiveAmount,
          costCurrency: liquidityTokenDecimals,
          costFormatted: formatCurrency(receiveAmount, router.locale, liquidityTokenDecimals, true),
          account,
          tx,
          claim: value,
          claimCurrency: cxTokenSymbol,
          claimFormatted: formatCurrency(value, router.locale, cxTokenSymbol, true),
          fee: claimPlatformFee,
          feeFormatted: formatPercent(
            toBN(claimPlatformFee).dividedBy(MULTIPLIER).toString(),
            router.locale
          )
        }

        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.CLAIM_COVER_COMPLETE,
          status: STATUS.PENDING,
          data: {
            value,
            receiveAmount,
            tokenSymbol,
            logData
          }
        })

        await txToast.push(
          tx,
          {
            pending: t`Claiming policy`,
            success: t`Claimed policy successfully`,
            failure: t`Could not claim policy`
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.CLAIM_COVER_COMPLETE,
                status: STATUS.SUCCESS
              })

              analyticsLogger(() => logClaimCover(logData))

              refetchBalance()
              onTxSuccess()
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.CLAIM_COVER_COMPLETE,
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

      const args = [
        cxTokenAddress,
        coverKey,
        productKey,
        incidentDate,
        convertToUnits(value).toString()
      ]
      writeContract({
        instance,
        methodName: 'claim',
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

  useEffect(() => {
    if (!value && error) {
      setError('')
      return
    }

    if (!value) {
      return
    }

    if (!account) {
      setError(t`Please connect your wallet`)
      return
    }

    if (!isValidNumber(value)) {
      setError(t`Invalid amount to claim`)
      return
    }

    if (isGreater(convertToUnits(value), balance || '0')) {
      setError(t`Insufficient Balance`)
      return
    }

    if (error) {
      setError('')
    }
  }, [account, balance, error, value])

  const canClaim =
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(allowance, convertToUnits(value || '0'))

  return {
    claiming,
    handleClaim,
    canClaim,
    loadingAllowance,
    approving,
    handleApprove,
    error,
    receiveAmount,
    claimPlatformFee
  }
}
