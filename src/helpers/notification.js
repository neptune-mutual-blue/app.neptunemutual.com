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
  [METHODS.UNSTAKING_WITHDRAW]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Withdrawn rewards successfully`,
        description: ''
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not withdraw rewards`,
        description: ''
      }
    }

    return { title: t`Withdrawing rewards`, description: '' }
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
        description: ''
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not resolve incident`,
        description: ''
      }
    }

    return { title: t`Resolving incident`, description: '' }
  },
  [METHODS.RESOLVE_INCIDENT_COMPLETE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Emergency resolved incident successfully`,
        description: ''
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not emergency resolve incident`,
        description: ''
      }
    }

    return { title: t`Emergency resolving incident`, description: '' }
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
        description: ''
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not approve ${tokenSymbol} tokens`,
        description: ''
      }
    }

    return { title: t`Approving ${tokenSymbol}`, description: '' }
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
        description: ''
      }
    }

    if (status === STATUS.FAILED) {
      return { title: t`Could not provide liquidity`, description: '' }
    }

    return { title: t`Providing Liquidity...`, description: '' }
  },
  [METHODS.REPORTING_UNSTAKE]: (status, _data) => {
    const symbol = _data.tokenSymbol || 'NPM'
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Unstaked ${symbol} Successfully`,
        description: ''
      }
    }

    if (status === STATUS.FAILED) {
      return { title: t`Could not unstake ${symbol}`, description: '' }
    }

    return { title: t`Unstaking ${symbol}`, description: '' }
  },
  [METHODS.REPORTING_UNSTAKE_CLAIM]: (status, _data) => {
    const symbol = _data.tokenSymbol || 'NPM'

    if (status === STATUS.SUCCESS) {
      return {
        title: t`Unstaked & claimed ${symbol} Successfully`,
        description: ''
      }
    }

    if (status === STATUS.FAILED) {
      return { title: t`Could not unstake & claim ${symbol}`, description: '' }
    }

    return { title: t`Unstaking & claiming ${symbol}`, description: '' }
  },
  [METHODS.POOL_CAPITALIZE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Capitalized pool successfully`,
        description: ''
      }
    }

    if (status === STATUS.FAILED) {
      return { title: t`Could not capitalize pool`, description: '' }
    }

    return { title: t`Capitalizing pool`, description: '' }
  },
  [METHODS.BOND_CLAIM]: (status, _data) => {
    const tokenSymbol = _data.tokenSymbol || ''
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Claimed ${tokenSymbol} successfully`,
        description: ''
      }
    }

    if (status === STATUS.FAILED) {
      return { title: t`Claimed ${tokenSymbol} successfully`, description: '' }
    }

    return { title: t`Claiming ${tokenSymbol}`, description: '' }
  },
  [METHODS.INCIDENT_FINALIZE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Finalized incident successfully`,
        description: ''
      }
    }

    if (status === STATUS.FAILED) {
      return { title: t`Could not finalize incident`, description: '' }
    }

    return { title: t`Finalizing incident`, description: '' }
  },
  [METHODS.LIQUIDITY_TOKEN_APPROVE]: (status, _data) => {
    const tokenSymbol = _data.tokenSymbol || ''
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Approved ${tokenSymbol} Successfully`,
        description: ''
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not approve ${tokenSymbol} tokens`,
        description: ''
      }
    }

    return { title: t`Approving ${tokenSymbol} tokens`, description: '' }
  },
  [METHODS.LIQUIDITY_REMOVE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Removed Liquidity Successfully`,
        description: ''
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not remove liquidity`,
        description: ''
      }
    }

    return { title: t`Could not remove liquidity`, description: '' }
  },
  [METHODS.LIQUIDITY_INFO]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Accrued interest successfully`,
        description: ''
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not accrue interest`,
        description: ''
      }
    }

    return { title: t`Accruing interest`, description: '' }
  },
  [METHODS.VOTE_APPROVE]: (status, _data) => {
    const tokenSymbol = _data.tokenSymbol || ''

    if (status === STATUS.SUCCESS) {
      return {
        title: t`Approved ${tokenSymbol} Successfully`,
        description: ''
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not approve ${tokenSymbol} tokens`,
        description: ''
      }
    }

    return { title: t`Approving ${tokenSymbol} tokens`, description: '' }
  },
  [METHODS.VOTE_ATTEST]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Attested successfully`,
        description: ''
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not attest`,
        description: ''
      }
    }

    return { title: t`Attesting...`, description: '' }
  },
  [METHODS.VOTE_REFUTE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: 'Refuted successfully',
        description: ''
      }
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not refute`,
        description: ''
      }
    }

    return { title: t`Refuting`, description: '' }
  },
  generic: (_status, _data) => {
    return { title: t`Notification`, description: '' }
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
