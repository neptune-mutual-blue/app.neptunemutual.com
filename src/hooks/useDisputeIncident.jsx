import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import {
  convertFromUnits,
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
  toBN
} from '@/utils/bn'
import { useNetwork } from '@/src/context/Network'
import { useTxToast } from '@/src/hooks/useTxToast'
import { useAppConstants } from '@/src/context/AppConstants'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useRouter } from 'next/router'
import { useGovernanceAddress } from '@/src/hooks/contracts/useGovernanceAddress'
import { useERC20Allowance } from '@/src/hooks/useERC20Allowance'
import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import { governance } from '@neptunemutual/sdk'
import { t } from '@lingui/macro'
import { METHODS } from '@/src/services/transactions/const'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { getActionMessage } from '@/src/helpers/notification'
import { Routes } from '@/src/config/routes'
import { logIncidentDisputed, logIncidentDisputeStakeApproved } from '@/src/services/logs'
import { analyticsLogger } from '@/utils/logger'
import { NetworkNames } from '@/lib/connect-wallet/config/chains'
import { safeParseBytes32String } from '@/utils/formatter/bytes32String'
import { formatCurrency } from '@/utils/formatter/currency'

export const useDisputeIncident = ({
  coverKey,
  productKey,
  value,
  incidentDate,
  minStake
}) => {
  const router = useRouter()

  const [approving, setApproving] = useState(false)
  const [disputing, setDisputing] = useState(false)

  const { account, library } = useWeb3React()
  const { networkId } = useNetwork()
  const governanceContractAddress = useGovernanceAddress()
  const { NPMTokenAddress, NPMTokenSymbol } = useAppConstants()
  const {
    allowance,
    refetch: updateAllowance,
    approve
  } = useERC20Allowance(NPMTokenAddress)
  const { balance } = useERC20Balance(NPMTokenAddress)

  const txToast = useTxToast()
  const { notifyError } = useErrorNotifier()

  useEffect(() => {
    updateAllowance(governanceContractAddress)
  }, [governanceContractAddress, updateAllowance])

  const handleApprove = async () => {
    setApproving(true)

    const cleanup = () => {
      setApproving(false)
    }
    const handleError = (err) => {
      notifyError(err, t`Could not approve ${NPMTokenSymbol} tokens`)
    }

    const onTransactionResult = async (tx) => {
      TransactionHistory.push({
        hash: tx.hash,
        methodName: METHODS.REPORT_DISPUTE_TOKEN_APPROVE,
        status: STATUS.PENDING,
        data: {
          value,
          tokenSymbol: NPMTokenSymbol,
          date: incidentDate
        }
      })

      try {
        await txToast.push(
          tx,
          {
            pending: getActionMessage(
              METHODS.REPORT_DISPUTE_TOKEN_APPROVE,
              STATUS.PENDING,
              {
                value,
                tokenSymbol: NPMTokenSymbol
              }
            ).title,
            success: getActionMessage(
              METHODS.REPORT_DISPUTE_TOKEN_APPROVE,
              STATUS.SUCCESS,
              {
                value,
                tokenSymbol: NPMTokenSymbol
              }
            ).title,
            failure: getActionMessage(
              METHODS.REPORT_DISPUTE_TOKEN_APPROVE,
              STATUS.FAILED,
              {
                value,
                tokenSymbol: NPMTokenSymbol
              }
            ).title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.REPORT_DISPUTE_TOKEN_APPROVE,
                status: STATUS.SUCCESS
              })
              analyticsLogger(() => logIncidentDisputeStakeApproved(networkId, account, coverKey, productKey, value, tx.hash))
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.REPORT_DISPUTE_TOKEN_APPROVE,
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

    approve(governanceContractAddress, convertToUnits(value).toString(), {
      onTransactionResult,
      onRetryCancel,
      onError
    })
  }

  const handleDispute = async (payload) => {
    setDisputing(true)

    const cleanup = () => {
      setDisputing(false)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)

      const wrappedResult = await governance.dispute(
        networkId,
        coverKey,
        productKey,
        payload,
        signerOrProvider
      )

      const tx = wrappedResult.result.tx

      TransactionHistory.push({
        hash: tx.hash,
        methodName: METHODS.REPORT_DISPUTE_COMPLETE,
        status: STATUS.PENDING,
        data: {
          value,
          tokenSymbol: NPMTokenSymbol,
          date: incidentDate
        }
      })

      await txToast.push(
        tx,
        {
          pending: getActionMessage(
            METHODS.REPORT_DISPUTE_COMPLETE,
            STATUS.PENDING
          ).title,
          success: getActionMessage(
            METHODS.REPORT_DISPUTE_COMPLETE,
            STATUS.SUCCESS
          ).title,
          failure: getActionMessage(
            METHODS.REPORT_DISPUTE_COMPLETE,
            STATUS.FAILED
          ).title
        },
        {
          onTxSuccess: () => {
            TransactionHistory.push({
              hash: tx.hash,
              methodName: METHODS.REPORT_DISPUTE_TOKEN_APPROVE,
              status: STATUS.SUCCESS
            })

            analyticsLogger(() => logIncidentDisputed({
              network: NetworkNames[networkId],
              networkId,
              account,
              coverKey,
              coverName: safeParseBytes32String(coverKey),
              productKey,
              productName: safeParseBytes32String(productKey),
              sales: 'N/A',
              salesCurrency: 'N/A',
              salesFormatted: 'N/A',
              title: payload.title,
              disputeProofs: payload.proofOfDispute,
              stake: value,
              stakeCurrency: NPMTokenSymbol,
              stakeFormatted: formatCurrency(
                value,
                router.locale,
                NPMTokenSymbol,
                true
              ).short,
              tx: tx.hash
            }))
            router.replace(
              Routes.ViewReport(coverKey, productKey, incidentDate)
            )
          },
          onTxFailure: () => {
            TransactionHistory.push({
              hash: tx.hash,
              methodName: METHODS.REPORT_DISPUTE_TOKEN_APPROVE,
              status: STATUS.FAILED
            })
          }
        }
      )
    } catch (err) {
      notifyError(err, t`Could not dispute`)
    } finally {
      cleanup()
    }
  }

  function getInputError () {
    let err = ''
    const _minStake = minStake && convertFromUnits(minStake)
    const _balance = convertFromUnits(balance)
    if (value) {
      const _value = toBN(value)

      err =
        !isValidNumber(value) ||
        isGreater(convertToUnits(value || '0'), balance)
          ? t`Error`
          : ''

      // set error if entered value is invalid
      if (_value.isGreaterThan(_balance)) err = 'Insufficient Balance'
      else if (_minStake && _value.isLessThan(_minStake)) { err = t`Insufficient Stake` }
    }

    // set error if balance is less than minStake
    if (_minStake && _balance.isLessThan(_minStake)) { err = t`Insufficient Balance` }

    return err
  }

  const canDispute =
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(allowance, convertToUnits(value || '0'))
  const error = getInputError()

  return {
    tokenAddress: NPMTokenAddress,
    tokenSymbol: NPMTokenSymbol,

    balance,
    approving,
    disputing,

    canDispute,
    error,

    handleApprove,
    handleDispute
  }
}
