import { LSHistory } from "@/src/services/transactions/history";

export const STATUS = {
  PENDING: 2,
  SUCCESS: 1,
  FAILED: 0,
};

const ERRORS = {
  TIMEOUT: "TIMEOUT",
};
export class TransactionHistory {
  static listener = [];

  /**
   * @typedef AddItem
   * @prop {string} hash
   * @prop {import('@/src/services/transactions/const').E_METHODS} methodName
   * @prop {number} status
   * @prop {any} [data]
   *
   *
   * @param {AddItem} item
   */
  static push(item) {
    const itemToUpdate = LSHistory.isExisting(item.hash);

    if (itemToUpdate) {
      const updatedItem = {
        hash: item.hash,
        methodName: item.methodName,
        status: item.status,
        timestamp: itemToUpdate.timestamp,
      };
      LSHistory.update(updatedItem);

      TransactionHistory.emit(updatedItem);

      return;
    }

    LSHistory.add({
      timestamp: Date.now(),
      ...item,
    });
  }

  /**
   * @param {AddItem} item
   */
  static emit(item) {
    TransactionHistory.listener.forEach((callback) => callback(item));
  }

  /**
   * @param {(item: AddItem) => void} callback
   */
  static on(callback) {
    TransactionHistory.listener.push(callback);

    return {
      off: () => {
        const index = TransactionHistory.listener.findIndex(
          (cb) => cb === callback
        );

        TransactionHistory.listener.splice(index, 1);
      },
    };
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
  static callback(provider, { success = noop, failure = noop }) {
    return (item) => {
      return provider
        .getTransactionReceipt(item.hash)
        .then((result) => {
          if (result === null) {
            return waitForTransactionWithTimeout(() =>
              provider.waitForTransaction(item.hash)
            );
          }

          return result;
        })
        .then(() => {
          success(item);
          TransactionHistory.push({
            hash: item.hash,
            methodName: item.methodName,
            status: STATUS.SUCCESS,
            data: item.data,
          });
        })
        .catch((result) => {
          if (result === ERRORS.TIMEOUT) {
            // don't do anything when am error timeout
            return;
          }

          failure(item);
          TransactionHistory.push({
            hash: item.hash,
            methodName: item.methodName,
            status: STATUS.FAILED,
            data: item.data,
          });
        });
    };
  }

  /**
   * @param {(item: ISTATE_VALUE) => Promise<unknown>} callback
   * @returns {Promise<unknown>}
   */
  static process(callback) {
    const items = LSHistory.getAllPending();
    return items.reduce((promise, item) => {
      return promise.then(() => callback(item));
    }, Promise.resolve());
  }
}

const noop = () => {};

/**
 *
 * @param {() => Promise<any>} callback
 */
function waitForTransactionWithTimeout(callback) {
  return new Promise((resolve, reject) => {
    const refTimeout = setTimeout(() => {
      reject(ERRORS.TIMEOUT);

      clearTimeout(refTimeout);
    }, 30000);

    callback()
      .then((result) => {
        resolve(result);
      })
      .catch((result) => {
        reject(result);
      })
      .finally(() => {
        clearTimeout(refTimeout);
      });
  });
}
