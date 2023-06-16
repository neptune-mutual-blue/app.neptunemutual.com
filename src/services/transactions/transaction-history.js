import { LSHistory } from '@/src/services/transactions/history'
import { timeouts } from '@/src/config/environment'

export const STATUS = {
  PENDING: 2,
  SUCCESS: 1,
  FAILED: 0
}

const ERRORS = {
  TIMEOUT: 'TIMEOUT'
}

export class TransactionHistory {
  static listener = [];

  /**
   * @typedef AddItem
   * @prop {string} hash
   * @prop {import('@/src/services/transactions/const').E_METHODS} methodName
   * @prop {number} status
   * @prop {any} [data]
   * @prop {boolean} [read]
   *
   * @param {AddItem} item
   */
  static push (item) {
    const itemToUpdate = LSHistory.isExisting(item.hash)

    if (itemToUpdate) {
      const updatedItem = {
        hash: item.hash,
        methodName: item.methodName,
        status: item.status,
        timestamp: itemToUpdate.timestamp
      }
      LSHistory.update(updatedItem)

      TransactionHistory.emit(updatedItem)

      return
    }

    const newItem = {
      timestamp: Date.now(),
      ...item
    }
    LSHistory.add(newItem)

    TransactionHistory.emit(newItem)
  }

  /**
   * @param {string} hash
   * @param {string} key
   * @param {any} value
   */
  static updateProperty (hash, key, value) {
    const itemToUpdate = LSHistory.isExisting(hash)

    if (itemToUpdate) {
      const updatedItem = {
        ...itemToUpdate,
        [key]: value
      }

      LSHistory.updateItem(updatedItem)

      TransactionHistory.emit(updatedItem)
    }
  }

  /**
   */
  static markAllAsRead () {
    const { data } = LSHistory.getUnread(1, 9999)

    if (data.length) {
      data.map(_item => {
        const updatedItem = { ..._item, read: true }

        LSHistory.updateItem(updatedItem)
        TransactionHistory.emit(updatedItem)

        return true
      })
    }
  }

  /**
   * @param {AddItem} item
   */
  static emit (item) {
    TransactionHistory.listener.forEach((callback) => { return callback(item) })
  }

  /**
   * @param {(item: AddItem) => void} callback
   */
  static on (callback) {
    TransactionHistory.listener.push(callback)

    return {
      off: () => {
        const index = TransactionHistory.listener.findIndex(
          (cb) => { return cb === callback }
        )

        TransactionHistory.listener.splice(index, 1)
      }
    }
  }

  /**
   * PENDING PROCESSING
   * @typedef ISTATE_VALUE
   * @prop {string} hash
   * @prop {import('@/src/services/transactions/const').E_METHODS} methodName
   * @prop {number} timestamp
   * @prop {object|string|number} [data]
   *
   *
   * @param {*} provider
   * @param {{
   *  success: (item: ISTATE_VALUE) => unknown,
   *  failure: (item: ISTATE_VALUE) => unknown,
   * }} callback
   * @returns {(item: ISTATE_VALUE) => Promise<unknown>}
   */
  static callback (provider, { success = () => {}, failure = () => {} }) {
    return (item) => {
      return provider
        .getTransactionReceipt(item.hash)
        .then((result) => {
          if (result === null) {
            return waitForTransactionWithTimeout(() => { return provider.waitForTransaction(item.hash) }
            )
          }

          return result
        })
        .then(() => {
          success(item)
          TransactionHistory.push({
            hash: item.hash,
            methodName: item.methodName,
            status: STATUS.SUCCESS,
            data: item.data
          })
        })
        .catch((result) => {
          if (result === ERRORS.TIMEOUT) {
            // don't do anything when am error timeout
            return
          }

          failure(item)
          TransactionHistory.push({
            hash: item.hash,
            methodName: item.methodName,
            status: STATUS.FAILED,
            data: item.data
          })
        })
    }
  }

  /**
   * @param {(item: ISTATE_VALUE) => Promise<unknown>} callback
   * @returns {Promise<unknown>}
   */
  static process (callback) {
    const items = LSHistory.getAllPending()

    return items.reduce((promise, item) => {
      return promise.then(() => { return callback(item) })
    }, Promise.resolve())
  }
}

/**
 *
 * @param {() => Promise<any>} callback
 */
function waitForTransactionWithTimeout (callback) {
  return new Promise((resolve, reject) => {
    const refTimeout = setTimeout(() => {
      reject(ERRORS.TIMEOUT)

      clearTimeout(refTimeout)
    }, timeouts.waitForTransactionWithTimeout)

    callback()
      .then((result) => {
        resolve(result)
      })
      .catch((result) => {
        reject(result)
      })
      .finally(() => {
        clearTimeout(refTimeout)
      })
  })
}
