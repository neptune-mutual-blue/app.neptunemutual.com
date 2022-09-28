import { VARIANTS } from '@/lib/toast/message'
import { STATUS } from '@/src/services/transactions/transaction-history'

/**
 * @param {number} status
 */
export function convertToIconVariant (status) {
  switch (status) {
    case STATUS.SUCCESS:
      return VARIANTS.Success.icon
    case STATUS.FAILED:
      return VARIANTS.Error.icon
    default:
      return VARIANTS.Loading.icon
  }
}
