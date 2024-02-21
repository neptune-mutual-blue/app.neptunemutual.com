import { useCallback } from 'react'

import { METHODS } from '@/src/services/transactions/const'
import { STATUS } from '@/src/services/transactions/transaction-history'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'

/**
/**
 * Returns an object containing notification messages for various transaction methods.
 *
 * @returns {Object.<string, (status: number, data: any, locale: string) => ({ title: string, description: string })>} An object where each key is a transaction method and each value is a function that returns an object with `title` and `description` properties based on the transaction status and data.
 */
const actionMessages = () => {
  return {
    [METHODS.VOTE_ESCROW_UNLOCK_APPROVE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'veNPM approved successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: 'Could not approve veNPM',
          description: displayValue(_data)
        }
      }

      return { title: 'Approving veNPM for unlock', description: displayValue(_data) }
    },
    [METHODS.VOTE_ESCROW_APPROVE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'NPM approved successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: 'Could not approve NPM',
          description: displayValue(_data)
        }
      }

      return { title: 'Approving NPM', description: displayValue(_data) }
    },
    [METHODS.VOTE_ESCROW_LOCK]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'NPM locked successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: 'Could not lock NPM',
          description: displayValue(_data)
        }
      }

      return { title: 'Locking NPM', description: displayValue(_data) }
    },
    [METHODS.VOTE_ESCROW_EXTEND]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'Extended lock period successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: 'Could not extend lock period',
          description: displayValue(_data)
        }
      }

      return { title: 'Extending lock period', description: displayValue(_data) }
    },
    [METHODS.VOTE_ESCROW_UNLOCK]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'Unlocked successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: 'Could not unlock NPM',
          description: displayValue(_data)
        }
      }

      return { title: 'Unlocking NPM', description: displayValue(_data) }
    },
    [METHODS.UNSTAKING_WITHDRAW]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'Withdrawn rewards successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: 'Could not withdraw rewards',
          description: displayValue(_data)
        }
      }

      return { title: 'Withdrawing rewards', description: displayValue(_data) }
    },
    [METHODS.UNSTAKING_DEPOSIT]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: `Unstaked ${tokenSymbol} successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: `Could not unstake ${tokenSymbol}`,
          description: displayValue(_data)
        }
      }

      return {
        title: `Unstaking ${tokenSymbol}`,
        description: displayValue(_data)
      }
    },
    [METHODS.STAKING_DEPOSIT_TOKEN_APPROVE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: `Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: `Could not approve ${tokenSymbol}`,
          description: displayValue(_data)
        }
      }

      return {
        title: `Approving ${tokenSymbol}`,
        description: displayValue(_data)
      }
    },
    [METHODS.STAKING_DEPOSIT_COMPLETE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: `Staked ${tokenSymbol} successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: `Could not stake ${tokenSymbol}`,
          description: displayValue(_data)
        }
      }

      return {
        title: `Staking ${tokenSymbol}`,
        description: displayValue(_data)
      }
    },
    [METHODS.RESOLVE_INCIDENT_APPROVE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'Resolved incident successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: 'Could not resolve incident',
          description: displayValue(_data)
        }
      }

      return { title: 'Resolving incident', description: displayValue(_data) }
    },
    [METHODS.RESOLVE_INCIDENT_COMPLETE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'Emergency resolved incident successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: 'Could not emergency resolve incident',
          description: displayValue(_data)
        }
      }

      return { title: 'Emergency resolving incident', description: displayValue(_data) }
    },
    [METHODS.REPORT_DISPUTE_TOKEN_APPROVE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: `Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: `Could not approve ${tokenSymbol} tokens`,
          description: displayValue(_data)
        }
      }

      return {
        title: `Approving ${tokenSymbol} tokens`,
        description: displayValue(_data)
      }
    },
    [METHODS.REPORT_DISPUTE_COMPLETE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'Disputed successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return { title: 'Could not dispute', description: displayValue(_data) }
      }

      return { title: 'Disputing...', description: displayValue(_data) }
    },
    [METHODS.CLAIM_COVER_APPROVE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: `Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: `Could not approve ${tokenSymbol} tokens`,
          description: displayValue(_data)
        }
      }

      return {
        title: `Approving ${tokenSymbol} tokens`,
        description: displayValue(_data)
      }
    },
    [METHODS.CLAIM_COVER_COMPLETE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'Claimed policy successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: 'Could not claim policy',
          description: displayValue(_data)
        }
      }

      return { title: 'Claiming policy', description: displayValue(_data) }
    },
    [METHODS.REPORT_INCIDENT_APPROVE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: `Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: `Could not approve ${tokenSymbol} tokens`,
          description: displayValue(_data)
        }
      }

      return {
        title: `Approving ${tokenSymbol} tokens`,
        description: displayValue(_data)
      }
    },
    [METHODS.REPORT_INCIDENT_COMPLETE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'Reported incident successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: 'Could not report incident',
          description: displayValue(_data)
        }
      }

      return { title: 'Reporting incident', description: displayValue(_data) }
    },
    [METHODS.POLICY_APPROVE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: `Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: `Could not approve ${tokenSymbol}`,
          description: displayValue(_data)
        }
      }

      return {
        title: `Approving ${tokenSymbol}`,
        description: displayValue(_data)
      }
    },
    [METHODS.POLICY_PURCHASE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'Purchased Policy Successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: 'Could not purchase policy',
          description: displayValue(_data)
        }
      }

      return { title: 'Purchasing Policy', description: displayValue(_data) }
    },
    [METHODS.BOND_APPROVE]: (status, _data) => {
      const tokenSymbol = 'LP'

      if (status === STATUS.SUCCESS) {
        return {
          title: `Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: `Could not approve ${tokenSymbol} tokens`,
          description: displayValue(_data)
        }
      }

      return {
        title: `Approving ${tokenSymbol} tokens`,
        description: displayValue(_data)
      }
    },
    [METHODS.BOND_CREATE]: (status, data, locale) => {
      const value = data.receiveAmount || data.value || ''
      const symbol = data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: 'Created bond successfully',
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
          title: 'Could not create bond',
          description: formatCurrency(
            convertFromUnits(value).toString(),
            locale,
            symbol,
            true
          ).long
        }
      }

      return {
        title: 'Creating bond',
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
          title: `Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: `Could not approve ${tokenSymbol} tokens`,
          description: displayValue(_data)
        }
      }

      return { title: `Approving ${tokenSymbol}`, description: displayValue(_data) }
    },
    [METHODS.LIQUIDITY_STAKE_APPROVE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: `Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: `Could not approve ${tokenSymbol} tokens`,
          description: displayValue(_data)
        }
      }

      return {
        title: `Approving ${tokenSymbol} tokens`,
        description: displayValue(_data)
      }
    },
    [METHODS.LIQUIDITY_PROVIDE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'Provided Liquidity Successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return { title: 'Could not provide liquidity', description: displayValue(_data) }
      }

      return { title: 'Providing Liquidity...', description: displayValue(_data) }
    },
    [METHODS.REPORTING_UNSTAKE]: (status, _data) => {
      const symbol = _data.tokenSymbol || 'NPM'
      if (status === STATUS.SUCCESS) {
        return {
          title: `Unstaked ${symbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return { title: `Could not unstake ${symbol}`, description: displayValue(_data) }
      }

      return { title: `Unstaking ${symbol}`, description: displayValue(_data) }
    },
    [METHODS.REPORTING_UNSTAKE_CLAIM]: (status, _data) => {
      const symbol = _data.tokenSymbol || 'NPM'

      if (status === STATUS.SUCCESS) {
        return {
          title: `Unstaked & claimed ${symbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return { title: `Could not unstake & claim ${symbol}`, description: displayValue(_data) }
      }

      return { title: `Unstaking & claiming ${symbol}`, description: displayValue(_data) }
    },
    [METHODS.POOL_CAPITALIZE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'Capitalized pool successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return { title: 'Could not capitalize pool', description: displayValue(_data) }
      }

      return { title: 'Capitalizing pool', description: displayValue(_data) }
    },
    [METHODS.BOND_CLAIM]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: `Claimed ${tokenSymbol} successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return { title: `Claimed ${tokenSymbol} successfully`, description: displayValue(_data) }
      }

      return { title: `Claiming ${tokenSymbol}`, description: displayValue(_data) }
    },
    [METHODS.INCIDENT_FINALIZE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'Finalized incident successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return { title: 'Could not finalize incident', description: displayValue(_data) }
      }

      return { title: 'Finalizing incident', description: displayValue(_data) }
    },
    [METHODS.LIQUIDITY_TOKEN_APPROVE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: `Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: `Could not approve ${tokenSymbol} tokens`,
          description: displayValue(_data)
        }
      }

      return { title: `Approving ${tokenSymbol} tokens`, description: displayValue(_data) }
    },
    [METHODS.LIQUIDITY_REMOVE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'Removed Liquidity Successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: 'Could not remove liquidity',
          description: displayValue(_data)
        }
      }

      return { title: 'Removing liquidity', description: displayValue(_data) }
    },
    [METHODS.LIQUIDITY_INFO]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'Accrued interest successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: 'Could not accrue interest',
          description: displayValue(_data)
        }
      }

      return { title: 'Accruing interest', description: displayValue(_data) }
    },
    [METHODS.UPDATE_WITHDRWAL_WINDOW]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'Updating withdrawal period successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: 'Could not update withdrawal period',
          description: displayValue(_data)
        }
      }

      return { title: 'Updating withdrawal period', description: displayValue(_data) }
    },
    [METHODS.VOTE_APPROVE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''

      if (status === STATUS.SUCCESS) {
        return {
          title: `Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: `Could not approve ${tokenSymbol} tokens`,
          description: displayValue(_data)
        }
      }

      return { title: `Approving ${tokenSymbol} tokens`, description: displayValue(_data) }
    },
    [METHODS.VOTE_ATTEST]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'Attested successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: 'Could not attest',
          description: displayValue(_data)
        }
      }

      return { title: 'Attesting...', description: displayValue(_data) }
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
          title: 'Could not refute',
          description: displayValue(_data)
        }
      }

      return { title: 'Refuting', description: displayValue(_data) }
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
          title: `Approved ${symbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: `Could not approve ${symbol} tokens`,
          description: displayValue(_data)
        }
      }

      return {
        title: `Approving ${symbol} tokens`,
        description: displayValue(_data)
      }
    },
    [METHODS.GCR_SET_GAUGE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'Gauge set successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: 'Could not set gauge',
          description: displayValue(_data)
        }
      }

      return { title: 'Setting gauge', description: displayValue(_data) }
    },
    [METHODS.GAUGE_POOL_TOKEN_APPROVE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol

      if (status === STATUS.SUCCESS) {
        return {
          title: `Approved ${tokenSymbol} successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: `Could not approve ${tokenSymbol}`,
          description: displayValue(_data)
        }
      }

      return { title: `Approving ${tokenSymbol} token`, description: displayValue(_data) }
    },
    [METHODS.GAUGE_POOL_DEPOSIT]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol

      if (status === STATUS.SUCCESS) {
        return {
          title: `Locked ${tokenSymbol} successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: `Could not lock ${tokenSymbol}`,
          description: displayValue(_data)
        }
      }

      return { title: `Locking ${tokenSymbol} token`, description: displayValue(_data) }
    },
    [METHODS.GAUGE_POOL_WITHDRAW]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol

      if (status === STATUS.SUCCESS) {
        return {
          title: `Unlocked ${tokenSymbol} successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: `Could not unlock ${tokenSymbol}`,
          description: displayValue(_data)
        }
      }

      return { title: `Unlocking ${tokenSymbol} token`, description: displayValue(_data) }
    },
    [METHODS.GAUGE_POOL_WITHDRAW_REWARDS]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: 'Received Rewards successfully',
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: 'Could not receive rewards',
          description: displayValue(_data)
        }
      }

      return { title: 'Receiving Rewards', description: displayValue(_data) }
    },
    generic: (_status, _data) => {
      return { title: 'Notification', description: displayValue(_data) }
    }
  }
}

export const useActionMessage = () => {
  const getActionMessage = useCallback(

    /**
     * Retrieves the action message based on the method name and status.
     *
     * @param {import('@/src/services/transactions/const').E_METHODS} methodName - The method name of the transaction.
     * @param {number} status - The status code of the transaction.
     * @param {Object} [data={}] - Additional data related to the transaction.
     * @param {string} [locale='en'] - The locale to be used for formatting messages.
     * @returns {{ title: string, description: string }} An object containing the title and description of the notification message.
     */
    (methodName, status, data = {}, locale = 'en') => {
      const _actionMessages = actionMessages()
      if (Object.prototype.hasOwnProperty.call(_actionMessages, methodName)) {
        return _actionMessages[methodName](status, data, locale)
      }

      return _actionMessages.generic(status, data, locale)
    }, [])

  return {
    getActionMessage
  }
}

function displayValue ({ value = '', tokenSymbol = '' }) {
  if (value && tokenSymbol) {
    return `${value} ${tokenSymbol}`
  }

  return ''
}
