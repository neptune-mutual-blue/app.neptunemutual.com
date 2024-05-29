import {
  useEffect,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { latestSnapshotIpfsData } from '@/src/config/constants'
import { abis } from '@/src/config/contracts/abis'
import { ChainConfig } from '@/src/config/hardcoded'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { useActionMessage } from '@/src/helpers/notification'
import { useERC20Allowance } from '@/src/hooks/useERC20Allowance'
import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useTxToast } from '@/src/hooks/useTxToast'
import { contractRead } from '@/src/services/readContract'
import { METHODS } from '@/src/services/transactions/const'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import {
  convertFromUnits,
  sumOf
} from '@/utils/bn'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { getEpochFromTitle } from '@/utils/snapshot'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { utils } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

export const useSetGauge = ({ title, distribution }) => {
  const [approving, setApproving] = useState(false)
  const [isSettingGauge, setIsSettingGauge] = useState(false)

  const { library, account } = useWeb3React()
  const { networkId } = useNetwork()

  const { NPMTokenAddress, NPMTokenSymbol, NPMTokenDecimals } = useAppConstants()

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

  const { notifyError } = useErrorNotifier()
  const { writeContract } = useTxPoster()
  const txToast = useTxToast()

  const { i18n } = useLingui()

  const { getActionMessage } = useActionMessage()

  const [hasSetGaugeRole, setHasSetGaugeRole] = useState(false)

  const gcrContractAddress = ChainConfig[networkId].gaugeControllerRegistry

  useEffect(() => {
    updateAllowance(gcrContractAddress)
  }, [gcrContractAddress, updateAllowance])

  useEffect(() => {
    (async () => {
      if (!account) {
        setHasSetGaugeRole(false)
      }

      try {
        const signerOrProvider = getProviderOrSigner(library, account, networkId)
        const instance = utils.contract.getContract(
          gcrContractAddress,
          abis.GaugeControllerRegistry,
          signerOrProvider
        )
        const hasRole = await contractRead({
          instance,
          methodName: 'hasRole',
          args: [safeFormatBytes32String('GaugeAgent'), account]
        })

        setHasSetGaugeRole(hasRole)
      } catch (err) {
        notifyError(err, t(i18n)`Could not check set gauge role`)

        setHasSetGaugeRole(false)
      }
    })()
  }, [account, gcrContractAddress, i18n, library, networkId, notifyError])

  const amountToDeposit = sumOf(...distribution.map((d) => { return d.emission })).toString()

  const handleApprove = async () => {
    setApproving(true)

    const cleanup = () => {
      setApproving(false)
    }
    const handleError = (err) => {
      notifyError(err, t(i18n)`Could not approve ${NPMTokenSymbol}`)
    }

    const onTransactionResult = async (tx) => {
      TransactionHistory.push({
        hash: tx.hash,
        methodName: METHODS.GCR_APPROVE,
        status: STATUS.PENDING,
        data: {
          value: convertFromUnits(amountToDeposit, NPMTokenDecimals),
          tokenSymbol: NPMTokenSymbol
        }
      })

      await txToast
        .push(
          tx,
          {
            pending: getActionMessage(METHODS.GCR_APPROVE, STATUS.PENDING)
              .title,
            success: getActionMessage(METHODS.GCR_APPROVE, STATUS.SUCCESS)
              .title,
            failure: getActionMessage(METHODS.GCR_APPROVE, STATUS.FAILED)
              .title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.GCR_APPROVE,
                status: STATUS.SUCCESS
              })
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.GCR_APPROVE,
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

    approve(gcrContractAddress, amountToDeposit, {
      onTransactionResult,
      onRetryCancel,
      onError
    })
  }

  const handleSetGauge = () => {
    setIsSettingGauge(true)

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const instance = utils.contract.getContract(
        gcrContractAddress,
        abis.GaugeControllerRegistry,
        signerOrProvider
      )

      const now = new Date()
      const epochEndDate = new Date(latestSnapshotIpfsData.epochEndsAt)
      const epochDuration = Math.ceil((epochEndDate.valueOf() - now.valueOf()) / 1000)

      const epoch = getEpochFromTitle(title)
      const args = [
        epoch,
        amountToDeposit,
        epochDuration,
        distribution
      ]

      const cleanup = () => {
        setIsSettingGauge(false)
        updateBalance()
        updateAllowance(gcrContractAddress)
      }

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.GCR_SET_GAUGE,
          status: STATUS.PENDING,
          data: {
            value: convertFromUnits(amountToDeposit, NPMTokenDecimals),
            tokenSymbol: NPMTokenSymbol
          }
        })

        await txToast.push(
          tx,
          {
            pending: getActionMessage(METHODS.GCR_SET_GAUGE, STATUS.PENDING)
              .title,
            success: getActionMessage(METHODS.GCR_SET_GAUGE, STATUS.SUCCESS)
              .title,
            failure: getActionMessage(METHODS.GCR_SET_GAUGE, STATUS.FAILED)
              .title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.GCR_SET_GAUGE,
                status: STATUS.SUCCESS
              })
              cleanup()
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.GCR_SET_GAUGE,
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
        notifyError(err, getActionMessage(METHODS.GCR_SET_GAUGE, STATUS.FAILED)
          .title)
        cleanup()
      }

      writeContract({
        instance,
        methodName: 'setGauge',
        args,
        onTransactionResult,
        onRetryCancel,
        onError
      })
    } catch (err) {
      console.error(err)
    }
  }

  return {
    approving,
    isSettingGauge,

    loadingAllowance,
    loadingBalance,
    allowance,
    balance,

    amountToDeposit,
    depositTokenDecimals: NPMTokenDecimals,
    depositTokenSymbol: NPMTokenSymbol,

    handleApprove,
    handleSetGauge,

    hasSetGaugeRole
  }
}
