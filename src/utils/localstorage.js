/**
 * @typedef {string} LSKey
 *
 * @readonly
 * @type {Object.<string, string>}
 */
export const KEYS = {
  DISCLAIMER_APPROVAL: 'disclaimerApproval',
  UNLIMITED_APPROVAL: 'unlimitedApproval',
  TRANSACTION_HISTORY: 'npmTransactionHistory',
  COOKIE_POLICY: 'acceptedCookiePolicy'
}

export const LOCAL_STORAGE_ERRORS = {
  INVALID_SHAPE: 'INVALID_SHAPE',
  NO_VALUE: 'NO_VALUE'
}

/**
 *
 * @param {any} data
 */
function toString (data) {
  if (typeof data === 'object') {
    return JSON.stringify(data)
  }

  return data
}

export class LocalStorage {
  static KEYS = KEYS
  static LOCAL_STORAGE_ERRORS = LOCAL_STORAGE_ERRORS
  /**
   *
   * @param {string} key
   * @param {any} value
   */
  static set (key, value) {
    localStorage.setItem(key, toString(value))
  }

  /**
   *
   * @param {string} key
   * @param {(value: any) => boolean} callback
   * @param {any} defaultValue
   */
  static get (key, callback, defaultValue) {
    const value = localStorage.getItem(key)
    try {
      return callback(value)
    } catch (e) {
      LocalStorage.set(key, defaultValue)

      return defaultValue
    }
  }
}
