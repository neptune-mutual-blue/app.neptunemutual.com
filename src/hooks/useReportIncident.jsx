import {
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { NetworkNames } from '@/lib/connect-wallet/config/chains'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import DateLib from '@/lib/date/DateLib'
import { getMonthNames } from '@/lib/dates'
import { Routes } from '@/src/config/routes'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { getActionMessage } from '@/src/helpers/notification'
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
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber
} from '@/utils/bn'
import { safeParseBytes32String } from '@/utils/formatter/bytes32String'
import { formatCurrency } from '@/utils/formatter/currency'
import { t } from '@lingui/macro'
import { governance } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

export const useReportIncident = ({ coverKey, productKey, value }) => {
  const router = useRouter()

  const [approving, setApproving] = useState(false)
  const [reporting, setReporting] = useState(false)

  const { account, library } = useWeb3React()
  const { networkId } = useNetwork()
  const governanceContractAddress = useGovernanceAddress()
  const { NPMTokenAddress, NPMTokenSymbol } = useAppConstants()
  const {
    allowance,
    loading: loadingAllowance,
    refetch: updateAllowance,
    approve
  } = useERC20Allowance(NPMTokenAddress)
  const {
    balance,
    loading: loadingBalance,
    refetch: updateBalance
  } = useERC20Balance(NPMTokenAddress)

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
        methodName: METHODS.REPORT_INCIDENT_APPROVE,
        status: STATUS.PENDING,
        data: {
          value,
          tokenSymbol: NPMTokenSymbol
        }
      })

      try {
        await txToast.push(
          tx,
          {
            pending: getActionMessage(
              METHODS.REPORT_INCIDENT_APPROVE,
              STATUS.PENDING,
              {
                value,
                tokenSymbol: NPMTokenSymbol
              }
            ).title,
            success: getActionMessage(
              METHODS.REPORT_INCIDENT_APPROVE,
              STATUS.SUCCESS,
              {
                value,
                tokenSymbol: NPMTokenSymbol
              }
            ).title,
            failure: getActionMessage(
              METHODS.REPORT_INCIDENT_APPROVE,
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
                methodName: METHODS.REPORT_INCIDENT_APPROVE,
                status: STATUS.SUCCESS
              })
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.REPORT_INCIDENT_APPROVE,
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

  const handleReport = async (payload) => {
    setReporting(true)

    const observedDate = DateLib.toDateFormat(payload.observed)

    const cleanup = () => {
      setReporting(false)

      return Promise.all([updateAllowance(governanceContractAddress), updateBalance()])
    }

    try {
      const ipfsHash = await writeToIpfs({
        payload,
        account,
        networkId,
        type: 'report',
        data: {
          coverKey,
          productKey
        }
      })

      if (!ipfsHash) { throw new Error() }

      const signerOrProvider = getProviderOrSigner(library, account, networkId)

      const wrappedResult = await governance.report(
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
        observed: payload.observed,
        observedMonth: observedDate.split('/')[0],
        observedMonthFormatted: getMonthNames(router.locale)[parseInt(observedDate.split('/')[0]) - 1],
        observedYear: observedDate.split('/')[2],
        proofs: payload.proofOfIncident,
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
        methodName: METHODS.REPORT_INCIDENT_COMPLETE,
        status: STATUS.PENDING,
        data: {
          value,
          tokenSymbol: NPMTokenSymbol,
          logData
        }
      })

      await txToast.push(
        tx,
        {
          pending: getActionMessage(
            METHODS.REPORT_INCIDENT_COMPLETE,
            STATUS.PENDING
          ).title,
          success: getActionMessage(
            METHODS.REPORT_INCIDENT_COMPLETE,
            STATUS.SUCCESS
          ).title,
          failure: getActionMessage(
            METHODS.REPORT_INCIDENT_COMPLETE,
            STATUS.FAILED
          ).title
        },
        {
          onTxSuccess: async () => {
            TransactionHistory.push({
              hash: tx.hash,
              methodName: METHODS.REPORT_INCIDENT_COMPLETE,
              status: STATUS.SUCCESS
            })

            await cleanup()

            router.replace(Routes.ActiveReports)
          },
          onTxFailure: () => {
            TransactionHistory.push({
              hash: tx.hash,
              methodName: METHODS.REPORT_INCIDENT_COMPLETE,
              status: STATUS.FAILED
            })
          }
        }
      )
    } catch (err) {
      notifyError(err, t`Could not report incident`)
      cleanup()
    }
  }

  const canReport =
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(allowance, convertToUnits(value || '0'))
  const isError =
    value &&
    (!isValidNumber(value) || isGreater(convertToUnits(value || '0'), balance))

  return {
    tokenAddress: NPMTokenAddress,
    tokenSymbol: NPMTokenSymbol,

    balance,
    loadingBalance,

    approving,
    loadingAllowance,

    reporting,

    canReport,
    isError,

    handleApprove,
    handleReport
  }
}
