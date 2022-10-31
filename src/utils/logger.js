/**
 * @param {Function} logFunction logging function name
 */

import { getLSAcceptedCookie } from '@/common/CookiePolicy'

export const analyticsLogger = (logFunction) => {
  const accepted = getLSAcceptedCookie()
  if (!accepted) {
    return
  }
  logFunction()
}
