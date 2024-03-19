import {
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { NetworkNames } from '@/lib/connect-wallet/config/chains'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { Routes } from '@/src/config/routes'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { useActionMessage } from '@/src/helpers/notification'
import {
  useGovernanceAddress
} from '@/src/hooks/contracts/useGovernanceAddress'
import { useERC20Allowance } from '@/src/hooks/useERC20Allowance'
import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useTxToast } from '@/src/hooks/useTxToast'
import { writeToIpfs } from '@/src/services/api/ipfs/write'
import { METHODS } from '@/src/services/transactions/const'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import {
  convertFromUnits,
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
  toBN
} from '@/utils/bn'
import { safeParseBytes32String } from '@/utils/formatter/bytes32String'
import { formatCurrency } from '@/utils/formatter/currency'
import { t } from '@lingui/macro'
import { governance } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'
import { useLingui } from '@lingui/react'

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

  const { i18n } = useLingui()

  const { getActionMessage } = useActionMessage()

  useEffect(() => {
    updateAllowance(governanceContractAddress)
  }, [governanceContractAddress, updateAllowance])

  const handleApprove = async () => {
    setApproving(true)

    const cleanup = () => {
      setApproving(false)
    }
    const handleError = (err) => {
      notifyError(err, t(i18n)`Could not approve ${NPMTokenSymbol} tokens`)
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
      const ipfsHash = await writeToIpfs({
        payload,
        account,
        networkId,
        type: 'dispute',
        data: {
          coverKey,
          productKey,
          incidentDate
        }
      })

      if (!ipfsHash) { throw new Error() }

      const signerOrProvider = getProviderOrSigner(library, account, networkId)

      const wrappedResult = await governance.dispute(
        networkId,
        coverKey,
        productKey,
        payload,
        ipfsHash,
        signerOrProvider
      )

      const tx = wrappedResult.result.tx

      const logData = {
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
      }

      TransactionHistory.push({
        hash: tx.hash,
        methodName: METHODS.REPORT_DISPUTE_COMPLETE,
        status: STATUS.PENDING,
        data: {
          value,
          tokenSymbol: NPMTokenSymbol,
          date: incidentDate,
          logData
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

            router.replace(
              Routes.ViewReport(coverKey, productKey, incidentDate, networkId)
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
      notifyError(err, t(i18n)`Could not dispute`)
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
          ? t(i18n)`Error`
          : ''

      // set error if entered value is invalid
      if (_value.isGreaterThan(_balance)) { err = 'Insufficient Balance' } else if (_minStake && _value.isLessThan(_minStake)) { err = t(i18n)`Insufficient Stake` }
    }

    // set error if balance is less than minStake
    if (_minStake && _balance.isLessThan(_minStake)) { err = t(i18n)`Insufficient Balance` }

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
