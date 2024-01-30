import { useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { registry, utils } from '@neptunemutual/sdk'
import {
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber
} from '@/utils/bn'
import { useNetwork } from '@/src/context/Network'
import { useTxToast } from '@/src/hooks/useTxToast'
import { useAppConstants } from '@/src/context/AppConstants'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useGovernanceAddress } from '@/src/hooks/contracts/useGovernanceAddress'
import { useERC20Allowance } from '@/src/hooks/useERC20Allowance'
import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import { useTxPoster } from '@/src/context/TxPoster'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { METHODS } from '@/src/services/transactions/const'
import { useActionMessage } from '@/src/helpers/notification'
import { useLingui } from '@lingui/react'

export const useVote = ({ coverKey, productKey, value, incidentDate }) => {
  const [approving, setApproving] = useState(false)
  const [voting, setVoting] = useState(false)

  const { account, library } = useWeb3React()
  const { networkId } = useNetwork()
  const { NPMTokenAddress, NPMTokenSymbol } = useAppConstants()
  const txToast = useTxToast()
  const governanceAddress = useGovernanceAddress()
  const { writeContract } = useTxPoster()
  const {
    allowance,
    approve,
    loading: loadingAllowance,
    refetch: updateAllowance
  } = useERC20Allowance(NPMTokenAddress)
  const {
    balance,
    loading: loadingBalance,
    refetch: updateBalance
  } = useERC20Balance(NPMTokenAddress)
  const { notifyError } = useErrorNotifier()

  const { i18n } = useLingui()

  const { getActionMessage } = useActionMessage()

  useEffect(() => {
    updateAllowance(governanceAddress)
  }, [governanceAddress, updateAllowance])

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
        methodName: METHODS.VOTE_APPROVE,
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
            pending: getActionMessage(METHODS.VOTE_APPROVE, STATUS.PENDING, {
              value,
              tokenSymbol: NPMTokenSymbol
            }).title,
            success: getActionMessage(METHODS.VOTE_APPROVE, STATUS.SUCCESS, {
              value,
              tokenSymbol: NPMTokenSymbol
            }).title,
            failure: getActionMessage(METHODS.VOTE_APPROVE, STATUS.FAILED, {
              value,
              tokenSymbol: NPMTokenSymbol
            }).title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.VOTE_APPROVE,
                status: STATUS.SUCCESS,
                data: {
                  value,
                  tokenSymbol: NPMTokenSymbol
                }
              })
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.VOTE_APPROVE,
                status: STATUS.FAILED,
                data: {
                  value,
                  tokenSymbol: NPMTokenSymbol
                }
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

    approve(governanceAddress, convertToUnits(value).toString(), {
      onTransactionResult,
      onRetryCancel,
      onError
    })
  }

  const handleAttest = async (onTxSuccess) => {
    setVoting(true)
    const cleanup = () => {
      updateBalance()
      updateAllowance(governanceAddress)
      setVoting(false)
    }
    const handleError = (err) => {
      notifyError(err, t(i18n)`Could not attest`)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)

      const instance = await registry.Governance.getInstance(
        networkId,
        signerOrProvider
      )

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.VOTE_ATTEST,
          status: STATUS.PENDING,
          data: {
            value,
            tokenSymbol: NPMTokenSymbol
          }
        })

        await txToast.push(
          tx,
          {
            pending: getActionMessage(METHODS.VOTE_ATTEST, STATUS.PENDING, {
              value,
              tokenSymbol: NPMTokenSymbol
            })
              .title,
            success: getActionMessage(METHODS.VOTE_ATTEST, STATUS.SUCCESS, {
              value,
              tokenSymbol: NPMTokenSymbol
            })
              .title,
            failure: getActionMessage(METHODS.VOTE_ATTEST, STATUS.FAILED, {
              value,
              tokenSymbol: NPMTokenSymbol
            }).title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.VOTE_ATTEST,
                status: STATUS.SUCCESS,
                data: {
                  value,
                  tokenSymbol: NPMTokenSymbol
                }
              })
              onTxSuccess()
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.VOTE_ATTEST,
                status: STATUS.FAILED,
                data: {
                  value,
                  tokenSymbol: NPMTokenSymbol
                }
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

      const productKeyArg = productKey || utils.keyUtil.toBytes32('')
      const args = [
        coverKey,
        productKeyArg,
        incidentDate,
        convertToUnits(value).toString()
      ]
      writeContract({
        instance,
        methodName: 'attest',
        onTransactionResult,
        onRetryCancel,
        onError,
        args
      })
    } catch (err) {
      handleError(err)
      cleanup()
    }
  }

  const handleRefute = async () => {
    setVoting(true)

    const cleanup = () => {
      setVoting(false)
      updateBalance()
      updateAllowance(governanceAddress)
    }
    const handleError = (err) => {
      notifyError(err, t(i18n)`Could not refute`)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)

      const instance = await registry.Governance.getInstance(
        networkId,
        signerOrProvider
      )

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.VOTE_REFUTE,
          status: STATUS.PENDING,
          data: {
            value,
            tokenSymbol: NPMTokenSymbol
          }
        })

        await txToast.push(
          tx,
          {
            pending: getActionMessage(METHODS.VOTE_REFUTE, STATUS.PENDING, {
              value,
              tokenSymbol: NPMTokenSymbol
            })
              .title,
            success: getActionMessage(METHODS.VOTE_REFUTE, STATUS.SUCCESS, {
              value,
              tokenSymbol: NPMTokenSymbol
            })
              .title,
            failure: getActionMessage(METHODS.VOTE_REFUTE, STATUS.FAILED, {
              value,
              tokenSymbol: NPMTokenSymbol
            }).title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.VOTE_REFUTE,
                status: STATUS.SUCCESS,
                data: {
                  value,
                  tokenSymbol: NPMTokenSymbol
                }
              })
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.VOTE_REFUTE,
                status: STATUS.FAILED,
                data: {
                  value,
                  tokenSymbol: NPMTokenSymbol
                }
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

      const productKeyArg = productKey || utils.keyUtil.toBytes32('')
      const args = [
        coverKey,
        productKeyArg,
        incidentDate,
        convertToUnits(value).toString()
      ]
      writeContract({
        instance,
        methodName: 'refute',
        onTransactionResult,
        onRetryCancel,
        onError,
        args
      })
    } catch (err) {
      handleError(err)
      cleanup()
    }
  }

  const canVote =
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
    approving,
    voting,

    loadingAllowance,
    loadingBalance,

    canVote,
    isError,

    handleApprove,
    handleAttest,
    handleRefute
  }
}
