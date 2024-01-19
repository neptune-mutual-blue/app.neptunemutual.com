import { METHODS } from '@/src/services/transactions/const'
import { STATUS } from '@/src/services/transactions/transaction-history'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useCallback } from 'react'

/**
/**
 * Returns an object containing notification messages for various transaction methods.
 *
 * @param {import('@lingui/core').I18n} i18n - The I18n instance from Lingui library.
 * @returns {Object.<string, (status: number, data: any, locale: string) => ({ title: string, description: string })>} An object where each key is a transaction method and each value is a function that returns an object with `title` and `description` properties based on the transaction status and data.
 */
const actionMessages = (i18n) => {
  return {
    [METHODS.VOTE_ESCROW_UNLOCK_APPROVE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`veNPM approved successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not approve veNPM`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Approving veNPM for unlock`, description: displayValue(_data) }
    },
    [METHODS.VOTE_ESCROW_APPROVE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`NPM approved successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not approve NPM`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Approving NPM`, description: displayValue(_data) }
    },
    [METHODS.VOTE_ESCROW_LOCK]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`NPM locked successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not lock NPM`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Locking NPM`, description: displayValue(_data) }
    },
    [METHODS.VOTE_ESCROW_EXTEND]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Extended lock period successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not extend lock period`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Extending lock period`, description: displayValue(_data) }
    },
    [METHODS.VOTE_ESCROW_UNLOCK]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Unlocked successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not unlock NPM`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Unlocking NPM`, description: displayValue(_data) }
    },
    [METHODS.UNSTAKING_WITHDRAW]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Withdrawn rewards successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not withdraw rewards`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Withdrawing rewards`, description: displayValue(_data) }
    },
    [METHODS.UNSTAKING_DEPOSIT]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Unstaked ${tokenSymbol} successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not unstake ${tokenSymbol}`,
          description: displayValue(_data)
        }
      }

      return {
        title: t(i18n)`Unstaking ${tokenSymbol}`,
        description: displayValue(_data)
      }
    },
    [METHODS.STAKING_DEPOSIT_TOKEN_APPROVE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not approve ${tokenSymbol}`,
          description: displayValue(_data)
        }
      }

      return {
        title: t(i18n)`Approving ${tokenSymbol}`,
        description: displayValue(_data)
      }
    },
    [METHODS.STAKING_DEPOSIT_COMPLETE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Staked ${tokenSymbol} successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not stake ${tokenSymbol}`,
          description: displayValue(_data)
        }
      }

      return {
        title: t(i18n)`Staking ${tokenSymbol}`,
        description: displayValue(_data)
      }
    },
    [METHODS.RESOLVE_INCIDENT_APPROVE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Resolved incident successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not resolve incident`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Resolving incident`, description: displayValue(_data) }
    },
    [METHODS.RESOLVE_INCIDENT_COMPLETE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Emergency resolved incident successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not emergency resolve incident`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Emergency resolving incident`, description: displayValue(_data) }
    },
    [METHODS.REPORT_DISPUTE_TOKEN_APPROVE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not approve ${tokenSymbol} tokens`,
          description: displayValue(_data)
        }
      }

      return {
        title: t(i18n)`Approving ${tokenSymbol} tokens`,
        description: displayValue(_data)
      }
    },
    [METHODS.REPORT_DISPUTE_COMPLETE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Disputed successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return { title: t(i18n)`Could not dispute`, description: displayValue(_data) }
      }

      return { title: t(i18n)`Disputing...`, description: displayValue(_data) }
    },
    [METHODS.CLAIM_COVER_APPROVE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not approve ${tokenSymbol} tokens`,
          description: displayValue(_data)
        }
      }

      return {
        title: t(i18n)`Approving ${tokenSymbol} tokens`,
        description: displayValue(_data)
      }
    },
    [METHODS.CLAIM_COVER_COMPLETE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Claimed policy successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not claim policy`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Claiming policy`, description: displayValue(_data) }
    },
    [METHODS.REPORT_INCIDENT_APPROVE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not approve ${tokenSymbol} tokens`,
          description: displayValue(_data)
        }
      }

      return {
        title: t(i18n)`Approving ${tokenSymbol} tokens`,
        description: displayValue(_data)
      }
    },
    [METHODS.REPORT_INCIDENT_COMPLETE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Reported incident successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not report incident`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Reporting incident`, description: displayValue(_data) }
    },
    [METHODS.POLICY_APPROVE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not approve ${tokenSymbol}`,
          description: displayValue(_data)
        }
      }

      return {
        title: t(i18n)`Approving ${tokenSymbol}`,
        description: displayValue(_data)
      }
    },
    [METHODS.POLICY_PURCHASE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Purchased Policy Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not purchase policy`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Purchasing Policy`, description: displayValue(_data) }
    },
    [METHODS.BOND_APPROVE]: (status, _data) => {
      const tokenSymbol = 'LP'

      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not approve ${tokenSymbol} tokens`,
          description: displayValue(_data)
        }
      }

      return {
        title: t(i18n)`Approving ${tokenSymbol} tokens`,
        description: displayValue(_data)
      }
    },
    [METHODS.BOND_CREATE]: (status, data, locale) => {
      const value = data.receiveAmount || data.value || ''
      const symbol = data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Created bond successfully`,
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
          title: t(i18n)`Could not create bond`,
          description: formatCurrency(
            convertFromUnits(value).toString(),
            locale,
            symbol,
            true
          ).long
        }
      }

      return {
        title: t(i18n)`Creating bond`,
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
          title: t(i18n)`Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not approve ${tokenSymbol} tokens`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Approving ${tokenSymbol}`, description: displayValue(_data) }
    },
    [METHODS.LIQUIDITY_STAKE_APPROVE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not approve ${tokenSymbol} tokens`,
          description: displayValue(_data)
        }
      }

      return {
        title: t(i18n)`Approving ${tokenSymbol} tokens`,
        description: displayValue(_data)
      }
    },
    [METHODS.LIQUIDITY_PROVIDE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Provided Liquidity Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return { title: t(i18n)`Could not provide liquidity`, description: displayValue(_data) }
      }

      return { title: t(i18n)`Providing Liquidity...`, description: displayValue(_data) }
    },
    [METHODS.REPORTING_UNSTAKE]: (status, _data) => {
      const symbol = _data.tokenSymbol || 'NPM'
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Unstaked ${symbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return { title: t(i18n)`Could not unstake ${symbol}`, description: displayValue(_data) }
      }

      return { title: t(i18n)`Unstaking ${symbol}`, description: displayValue(_data) }
    },
    [METHODS.REPORTING_UNSTAKE_CLAIM]: (status, _data) => {
      const symbol = _data.tokenSymbol || 'NPM'

      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Unstaked & claimed ${symbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return { title: t(i18n)`Could not unstake & claim ${symbol}`, description: displayValue(_data) }
      }

      return { title: t(i18n)`Unstaking & claiming ${symbol}`, description: displayValue(_data) }
    },
    [METHODS.POOL_CAPITALIZE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Capitalized pool successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return { title: t(i18n)`Could not capitalize pool`, description: displayValue(_data) }
      }

      return { title: t(i18n)`Capitalizing pool`, description: displayValue(_data) }
    },
    [METHODS.BOND_CLAIM]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Claimed ${tokenSymbol} successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return { title: t(i18n)`Claimed ${tokenSymbol} successfully`, description: displayValue(_data) }
      }

      return { title: t(i18n)`Claiming ${tokenSymbol}`, description: displayValue(_data) }
    },
    [METHODS.INCIDENT_FINALIZE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Finalized incident successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return { title: t(i18n)`Could not finalize incident`, description: displayValue(_data) }
      }

      return { title: t(i18n)`Finalizing incident`, description: displayValue(_data) }
    },
    [METHODS.LIQUIDITY_TOKEN_APPROVE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not approve ${tokenSymbol} tokens`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Approving ${tokenSymbol} tokens`, description: displayValue(_data) }
    },
    [METHODS.LIQUIDITY_REMOVE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Removed Liquidity Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not remove liquidity`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Removing liquidity`, description: displayValue(_data) }
    },
    [METHODS.LIQUIDITY_INFO]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Accrued interest successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not accrue interest`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Accruing interest`, description: displayValue(_data) }
    },
    [METHODS.UPDATE_WITHDRWAL_WINDOW]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Updating withdrawal period successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not update withdrawal period`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Updating withdrawal period`, description: displayValue(_data) }
    },
    [METHODS.VOTE_APPROVE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol || ''

      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Approved ${tokenSymbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not approve ${tokenSymbol} tokens`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Approving ${tokenSymbol} tokens`, description: displayValue(_data) }
    },
    [METHODS.VOTE_ATTEST]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Attested successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not attest`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Attesting...`, description: displayValue(_data) }
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
          title: t(i18n)`Could not refute`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Refuting`, description: displayValue(_data) }
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
          title: t(i18n)`Approved ${symbol} Successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not approve ${symbol} tokens`,
          description: displayValue(_data)
        }
      }

      return {
        title: t(i18n)`Approving ${symbol} tokens`,
        description: displayValue(_data)
      }
    },
    [METHODS.GCR_SET_GAUGE]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Gauge set successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not set gauge`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Setting gauge`, description: displayValue(_data) }
    },
    [METHODS.GAUGE_POOL_TOKEN_APPROVE]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol

      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Approved ${tokenSymbol} successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not approve ${tokenSymbol}`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Approving ${tokenSymbol} token`, description: displayValue(_data) }
    },
    [METHODS.GAUGE_POOL_DEPOSIT]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol

      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Locked ${tokenSymbol} successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not lock ${tokenSymbol}`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Locking ${tokenSymbol} token`, description: displayValue(_data) }
    },
    [METHODS.GAUGE_POOL_WITHDRAW]: (status, _data) => {
      const tokenSymbol = _data.tokenSymbol

      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Unlocked ${tokenSymbol} successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not unlock ${tokenSymbol}`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Unlocking ${tokenSymbol} token`, description: displayValue(_data) }
    },
    [METHODS.GAUGE_POOL_WITHDRAW_REWARDS]: (status, _data) => {
      if (status === STATUS.SUCCESS) {
        return {
          title: t(i18n)`Received Rewards successfully`,
          description: displayValue(_data)
        }
      }

      if (status === STATUS.FAILED) {
        return {
          title: t(i18n)`Could not receive rewards`,
          description: displayValue(_data)
        }
      }

      return { title: t(i18n)`Receiving Rewards`, description: displayValue(_data) }
    },
    generic: (_status, _data) => {
      return { title: t(i18n)`Notification`, description: displayValue(_data) }
    }
  }
}

export const useActionMessage = () => {
  const { i18n } = useLingui()

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
      const _actionMessages = actionMessages(i18n)
      if (Object.prototype.hasOwnProperty.call(_actionMessages, methodName)) {
        return _actionMessages[methodName](status, data, locale)
      }

      return _actionMessages.generic(status, data, locale)
    }, [i18n])

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
