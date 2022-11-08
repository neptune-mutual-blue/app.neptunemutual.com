import { useNetwork } from '@/src/context/Network'
import { useWeb3React } from '@web3-react/core'
import { useTxToast } from '@/src/hooks/useTxToast'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useEffect, useRef } from 'react'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { getActionMessage } from '@/src/helpers/notification'
import { LSHistory } from '@/src/services/transactions/history'
import { METHODS } from '@/src/services/transactions/const'
import { logAddLiquidity, logBondClaimed, logBondCreated, logClaimCover, logIncidentDisputed, logIncidentReported, logPolicyPurchase, logRemoveLiquidity, logStakingPoolDeposit, logStakingPoolWithdraw, logUnstakeReportingRewards } from '@/src/services/logs'
import { analyticsLogger } from '@/utils/logger'
/**
 * @callback INotify
 * @param {string} title
 * @param {string} hash
 * @returns {void}
 *
 * @typedef ITxToast
 * @prop {INotify} pushSuccess
 * @prop {INotify} pushError
 */

const handleLog = (methodName, logData) => {
  let logFunction = (a) => a

  switch (methodName) {
    case METHODS.POLICY_PURCHASE:
      logFunction = logPolicyPurchase
      break

    case METHODS.LIQUIDITY_PROVIDE:
      logFunction = logAddLiquidity
      break

    case METHODS.REPORT_DISPUTE_COMPLETE:
      logFunction = logIncidentDisputed
      break

    case METHODS.LIQUIDITY_REMOVE:
      logFunction = logRemoveLiquidity
      break

    case METHODS.REPORTING_UNSTAKE:
      logFunction = logUnstakeReportingRewards
      break

    case METHODS.CLAIM_COVER_COMPLETE:
      logFunction = logClaimCover
      break

    case METHODS.BOND_CREATE:
      logFunction = logBondCreated
      break

    case METHODS.BOND_CLAIM:
      logFunction = logBondClaimed
      break

    case METHODS.STAKING_DEPOSIT_COMPLETE:
      logFunction = logStakingPoolDeposit
      break

    case METHODS.UNSTAKING_DEPOSIT:
      logFunction = logStakingPoolWithdraw
      break

    case METHODS.REPORT_INCIDENT_COMPLETE:
      logFunction = logIncidentReported
      break

    default:
      break
  }

  analyticsLogger(() => {
    logFunction(logData)
  })
}

export function useTransactionHistory () {
  const { account, library } = useWeb3React()
  const { networkId } = useNetwork()
  const txToast = useTxToast()

  const init = useRef(true)

  useEffect(() => {
    LSHistory.init()
  }, [])

  useEffect(() => {
    if (account && networkId) {
      init.current = true
    }
  }, [account, networkId])

  useEffect(() => {
    if (!networkId || !account || !library) return

    LSHistory.setId(account, networkId);

    (async () => {
      if (init.current) {
        const signerOrProvider = getProviderOrSigner(
          library,
          account,
          networkId
        )

        if (signerOrProvider && signerOrProvider.provider) {
          init.current = false

          TransactionHistory.process(
            TransactionHistory.callback(signerOrProvider.provider, {
              success: ({ hash, methodName, data }) => {
                if (data?.logData) {
                  handleLog(methodName, data.logData)
                  delete data.logData
                }

                txToast.pushSuccess(
                  getActionMessage(methodName, STATUS.SUCCESS, data).title,
                  hash
                )
              },
              failure: ({ hash, methodName, data }) => {
                txToast.pushError(
                  getActionMessage(methodName, STATUS.FAILED, data).title,
                  hash
                )
              }
            })
          )
        }
      }
    })()
  }, [account, library, networkId, txToast])

  return null
}
