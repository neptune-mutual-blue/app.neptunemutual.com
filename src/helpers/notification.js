import { METHODS } from '@/src/services/transactions/const'
import { STATUS } from '@/src/services/transactions/transaction-history'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { t } from '@lingui/macro'

/**
 *
 * @type {Object.<string, (status: number, data: any, locale: string) => ({ title: string, description: string })>}
 */
const actionMessages = {
  [METHODS.VOTE_ESCROW_UNLOCK_APPROVE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`veNPM approved successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not approve veNPM`,
        description: displayValue(_data)
      }
    }

    return { title: t`Approving veNPM for unlock`, description: displayValue(_data) }
  },
  [METHODS.VOTE_ESCROW_APPROVE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`NPM approved successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not approve NPM`,
        description: displayValue(_data)
      }
    }

    return { title: t`Approving NPM`, description: displayValue(_data) }
  },
  [METHODS.VOTE_ESCROW_LOCK]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`NPM locked successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not lock NPM`,
        description: displayValue(_data)
      }
    }

    return { title: t`Locking NPM`, description: displayValue(_data) }
  },
  [METHODS.VOTE_ESCROW_EXTEND]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Extended lock period successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not extend lock period`,
        description: displayValue(_data)
      }
    }

    return { title: t`Extending lock period`, description: displayValue(_data) }
  },
  [METHODS.VOTE_ESCROW_UNLOCK]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Unlocked successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not unlock NPM`,
        description: displayValue(_data)
      }
    }

    return { title: t`Unlocking NPM`, description: displayValue(_data) }
  },
  [METHODS.UNSTAKING_WITHDRAW]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Withdrawn rewards successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not withdraw rewards`,
        description: displayValue(_data)
      }
    }

    return { title: t`Withdrawing rewards`, description: displayValue(_data) }
  },
  [METHODS.UNSTAKING_DEPOSIT]: (status, _data) => {
    const tokenSymbol = _data.tokenSymbol || ''
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Unstaked ${tokenSymbol} successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not unstake ${tokenSymbol}`,
        description: displayValue(_data)
      }
    }

    return {
      title: t`Unstaking ${tokenSymbol}`,
      description: displayValue(_data)
    }
  },
  [METHODS.STAKING_DEPOSIT_TOKEN_APPROVE]: (status, _data) => {
    const tokenSymbol = _data.tokenSymbol || ''
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Approved ${tokenSymbol} Successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not approve ${tokenSymbol}`,
        description: displayValue(_data)
      }
    }

    return {
      title: t`Approving ${tokenSymbol}`,
      description: displayValue(_data)
    }
  },
  [METHODS.STAKING_DEPOSIT_COMPLETE]: (status, _data) => {
    const tokenSymbol = _data.tokenSymbol || ''
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Staked ${tokenSymbol} successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not stake ${tokenSymbol}`,
        description: displayValue(_data)
      }
    }

    return {
      title: t`Staking ${tokenSymbol}`,
      description: displayValue(_data)
    }
  },
  [METHODS.RESOLVE_INCIDENT_APPROVE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Resolved incident successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not resolve incident`,
        description: displayValue(_data)
      }
    }

    return { title: t`Resolving incident`, description: displayValue(_data) }
  },
  [METHODS.RESOLVE_INCIDENT_COMPLETE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Emergency resolved incident successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not emergency resolve incident`,
        description: displayValue(_data)
      }
    }

    return { title: t`Emergency resolving incident`, description: displayValue(_data) }
  },
  [METHODS.REPORT_DISPUTE_TOKEN_APPROVE]: (status, _data) => {
    const tokenSymbol = _data.tokenSymbol || ''
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Approved ${tokenSymbol} Successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not approve ${tokenSymbol} tokens`,
        description: displayValue(_data)
      }
    }

    return {
      title: t`Approving ${tokenSymbol} tokens`,
      description: displayValue(_data)
    }
  },
  [METHODS.REPORT_DISPUTE_COMPLETE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Disputed successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return { title: t`Could not dispute`, description: displayValue(_data) }
    }

    return { title: t`Disputing...`, description: displayValue(_data) }
  },
  [METHODS.CLAIM_COVER_APPROVE]: (status, _data) => {
    const tokenSymbol = _data.tokenSymbol || ''
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Approved ${tokenSymbol} Successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not approve ${tokenSymbol} tokens`,
        description: displayValue(_data)
      }
    }

    return {
      title: t`Approving ${tokenSymbol} tokens`,
      description: displayValue(_data)
    }
  },
  [METHODS.CLAIM_COVER_COMPLETE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Claimed policy successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not claim policy`,
        description: displayValue(_data)
      }
    }

    return { title: t`Claiming policy`, description: displayValue(_data) }
  },
  [METHODS.REPORT_INCIDENT_APPROVE]: (status, _data) => {
    const tokenSymbol = _data.tokenSymbol || ''
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Approved ${tokenSymbol} Successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not approve ${tokenSymbol} tokens`,
        description: displayValue(_data)
      }
    }

    return {
      title: t`Approving ${tokenSymbol} tokens`,
      description: displayValue(_data)
    }
  },
  [METHODS.REPORT_INCIDENT_COMPLETE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Reported incident successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not report incident`,
        description: displayValue(_data)
      }
    }

    return { title: t`Reporting incident`, description: displayValue(_data) }
  },
  [METHODS.POLICY_APPROVE]: (status, _data) => {
    const tokenSymbol = _data.tokenSymbol || ''
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Approved ${tokenSymbol} Successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not approve ${tokenSymbol}`,
        description: displayValue(_data)
      }
    }

    return {
      title: t`Approving ${tokenSymbol}`,
      description: displayValue(_data)
    }
  },
  [METHODS.POLICY_PURCHASE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Purchased Policy Successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not purchase policy`,
        description: displayValue(_data)
      }
    }

    return { title: t`Purchasing Policy`, description: displayValue(_data) }
  },
  [METHODS.BOND_APPROVE]: (status, _data) => {
    const tokenSymbol = 'LP'

    if (status === STATUS.SUCCESS) {
      return {
        title: t`Approved ${tokenSymbol} Successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not approve ${tokenSymbol} tokens`,
        description: displayValue(_data)
      }
    }

    return {
      title: t`Approving ${tokenSymbol} tokens`,
      description: displayValue(_data)
    }
  },
  [METHODS.BOND_CREATE]: (status, data, locale) => {
    const value = data.receiveAmount || data.value || ''
    const symbol = data.tokenSymbol || ''
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Created bond successfully`,
        description: formatCurrency(
          convertFromUnits(value).toString(),
          locale,
          symbol,
          true
        ).long
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not create bond`,
        description: formatCurrency(
          convertFromUnits(value).toString(),
          locale,
          symbol,
          true
        ).long
      }
    }

    return {
      title: t`Creating bond`,
      description: formatCurrency(
        convertFromUnits(value).toString(),
        locale,
        symbol,
        true
      ).long
    }
  },
  [METHODS.LIQUIDITY_PROVIDE_APPROVE]: (status, _data) => {
    const tokenSymbol = _data.tokenSymbol || ''
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Approved ${tokenSymbol} Successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not approve ${tokenSymbol} tokens`,
        description: displayValue(_data)
      }
    }

    return { title: t`Approving ${tokenSymbol}`, description: displayValue(_data) }
  },
  [METHODS.LIQUIDITY_STAKE_APPROVE]: (status, _data) => {
    const tokenSymbol = _data.tokenSymbol || ''
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Approved ${tokenSymbol} Successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not approve ${tokenSymbol} tokens`,
        description: displayValue(_data)
      }
    }

    return {
      title: t`Approving ${tokenSymbol} tokens`,
      description: displayValue(_data)
    }
  },
  [METHODS.LIQUIDITY_PROVIDE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Provided Liquidity Successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return { title: t`Could not provide liquidity`, description: displayValue(_data) }
    }

    return { title: t`Providing Liquidity...`, description: displayValue(_data) }
  },
  [METHODS.REPORTING_UNSTAKE]: (status, _data) => {
    const symbol = _data.tokenSymbol || 'NPM'
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Unstaked ${symbol} Successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return { title: t`Could not unstake ${symbol}`, description: displayValue(_data) }
    }

    return { title: t`Unstaking ${symbol}`, description: displayValue(_data) }
  },
  [METHODS.REPORTING_UNSTAKE_CLAIM]: (status, _data) => {
    const symbol = _data.tokenSymbol || 'NPM'

    if (status === STATUS.SUCCESS) {
      return {
        title: t`Unstaked & claimed ${symbol} Successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return { title: t`Could not unstake & claim ${symbol}`, description: displayValue(_data) }
    }

    return { title: t`Unstaking & claiming ${symbol}`, description: displayValue(_data) }
  },
  [METHODS.POOL_CAPITALIZE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Capitalized pool successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return { title: t`Could not capitalize pool`, description: displayValue(_data) }
    }

    return { title: t`Capitalizing pool`, description: displayValue(_data) }
  },
  [METHODS.BOND_CLAIM]: (status, _data) => {
    const tokenSymbol = _data.tokenSymbol || ''
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Claimed ${tokenSymbol} successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return { title: t`Claimed ${tokenSymbol} successfully`, description: displayValue(_data) }
    }

    return { title: t`Claiming ${tokenSymbol}`, description: displayValue(_data) }
  },
  [METHODS.INCIDENT_FINALIZE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Finalized incident successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return { title: t`Could not finalize incident`, description: displayValue(_data) }
    }

    return { title: t`Finalizing incident`, description: displayValue(_data) }
  },
  [METHODS.LIQUIDITY_TOKEN_APPROVE]: (status, _data) => {
    const tokenSymbol = _data.tokenSymbol || ''
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Approved ${tokenSymbol} Successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not approve ${tokenSymbol} tokens`,
        description: displayValue(_data)
      }
    }

    return { title: t`Approving ${tokenSymbol} tokens`, description: displayValue(_data) }
  },
  [METHODS.LIQUIDITY_REMOVE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Removed Liquidity Successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not remove liquidity`,
        description: displayValue(_data)
      }
    }

    return { title: t`Removing liquidity`, description: displayValue(_data) }
  },
  [METHODS.LIQUIDITY_INFO]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Accrued interest successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not accrue interest`,
        description: displayValue(_data)
      }
    }

    return { title: t`Accruing interest`, description: displayValue(_data) }
  },
  [METHODS.UPDATE_WITHDRWAL_WINDOW]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Updating withdrawal period successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not update withdrawal period`,
        description: displayValue(_data)
      }
    }

    return { title: t`Updating withdrawal period`, description: displayValue(_data) }
  },
  [METHODS.VOTE_APPROVE]: (status, _data) => {
    const tokenSymbol = _data.tokenSymbol || ''

    if (status === STATUS.SUCCESS) {
      return {
        title: t`Approved ${tokenSymbol} Successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not approve ${tokenSymbol} tokens`,
        description: displayValue(_data)
      }
    }

    return { title: t`Approving ${tokenSymbol} tokens`, description: displayValue(_data) }
  },
  [METHODS.VOTE_ATTEST]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Attested successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not attest`,
        description: displayValue(_data)
      }
    }

    return { title: t`Attesting...`, description: displayValue(_data) }
  },
  [METHODS.VOTE_REFUTE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: 'Refuted successfully',
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not refute`,
        description: displayValue(_data)
      }
    }

    return { title: t`Refuting`, description: displayValue(_data) }
  },
  [METHODS.BRIDGE_APPROVE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: `Approved ${_data.tokenSymbol} successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: `Could not approve ${_data.tokenSymbol}`,
        description: displayValue(_data)
      }
    }

    return {
      title: `Approving ${_data.tokenSymbol}`,
      description: displayValue(_data)
    }
  },
  [METHODS.BRIDGE_TOKEN]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: 'NPM Bridge successful',
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: 'Could not bridge NPM',
        description: displayValue(_data)
      }
    }

    return { title: 'Processing NPM bridge', description: displayValue(_data) }
  },
  [METHODS.GCR_APPROVE]: (status, _data) => {
    const symbol = _data.tokenSymbol || ''

    if (status === STATUS.SUCCESS) {
      return {
        title: t`Approved ${symbol} Successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not approve ${symbol} tokens`,
        description: displayValue(_data)
      }
    }

    return {
      title: t`Approving ${symbol} tokens`,
      description: displayValue(_data)
    }
  },
  [METHODS.GCR_SET_GAUGE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Gauge set successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not set gauge`,
        description: displayValue(_data)
      }
    }

    return { title: t`Setting gauge`, description: displayValue(_data) }
  },
  [METHODS.GAUGE_POOL_TOKEN_APPROVE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Approved ${_data.tokenSymbol} successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not approve ${_data.tokenSymbol}`,
        description: displayValue(_data)
      }
    }

    return { title: t`Approving ${_data.tokenSymbol} token`, description: displayValue(_data) }
  },
  [METHODS.GAUGE_POOL_DEPOSIT]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Locked ${_data.tokenSymbol} successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not lock ${_data.tokenSymbol}`,
        description: displayValue(_data)
      }
    }

    return { title: t`Locking ${_data.tokenSymbol} token`, description: displayValue(_data) }
  },
  [METHODS.GAUGE_POOL_WITHDRAW]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Unlocked ${_data.tokenSymbol} successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not unlock ${_data.tokenSymbol}`,
        description: displayValue(_data)
      }
    }

    return { title: t`Unlocking ${_data.tokenSymbol} token`, description: displayValue(_data) }
  },
  [METHODS.GAUGE_POOL_WITHDRAW_REWARDS]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Received Rewards successfully`,
        description: displayValue(_data)
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not receive rewards`,
        description: displayValue(_data)
      }
    }

    return { title: t`Receiving Rewards`, description: displayValue(_data) }
  },
  generic: (_status, _data) => {
    return { title: t`Notification`, description: displayValue(_data) }
  }
}

/**
 *
 * @param {import('@/src/services/transactions/const').E_METHODS} methodName
 * @param {number} status
 * @param {any} [data]
 * @returns {{ title: string, description: string }}
 */
export function getActionMessage (methodName, status, data = {}, locale = 'en') {
  if (Object.prototype.hasOwnProperty.call(actionMessages, methodName)) {
    return actionMessages[methodName](status, data, locale)
  }

  return actionMessages.generic(status, data, locale)
}

function displayValue ({ value = '', tokenSymbol = '' }) {
  if (value && tokenSymbol) {
    return `${value} ${tokenSymbol}`
  }

  return ''
}
