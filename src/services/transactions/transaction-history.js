import { LS, METHODS } from "@/src/services/transactions/local-storage-handler";

/**
 * @typedef {import('./local-storage-handler').ISTATE_VALUE} ISTATE_VALUE
 */

const noop = () => {};

export class TransactionHistory {
  static METHODS = METHODS; // this is just to expose methods

  /**
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
            return provider.waitForTransaction(item.hash);
          }
        })
        .then(() => success(item))
        .catch(() => failure(item));
    };
  }

  /**
   * process
   * using provided callback
      * purpose is to simplify and unify repeated transactions
    useEffect(() => {
      TransactionHistory.process(
        TransactionHistory.METHODS.CREATE_BOND,
        TransactionHistory.callback(instance, {
          success: (hash) => notify('success),
          failure: (hash) => notify('failure),
        })
      );
    }, [instance, notify])


   * using custom callback
      * purpose is for transactions with much more complex implementation
    useEffect(() => {
      TransactionHistory.process(TransactionHistory.METHODS.CREATE_BOND, hash => {
        // important to return for finally callback to work properly
        return instance.getTransactionReceipt(hash).then(result => {
          if (result === null) {
            return instance.waitForTransaction(hash)
          }

          return;
        }).then(() => {
          notify(`success`)
        }).catch(() => {
          notify(`failure`)
        })
      })
    }, [instance, notify])

   */
  /**
   * @param {METHODS} methodName
   * @param {(item: ISTATE_VALUE) => Promise<unknown>} callback
   * @returns {Promise<unknown>}
   */
  static process(methodName, callback) {
    const items = LS.get(methodName);
    return items.reduce((promise, item) => {
      return promise.then(() =>
        callback(item).finally(() => {
          LS.remove(methodName, item.hash);
        })
      );
    }, Promise.resolve());
  }

  /**
   *
   * @param {METHODS} methodName
   * @param {ISTATE_VALUE} item
   * @returns {void}
   */
  static add(methodName, item) {
    return LS.add(methodName, item);
  }

  /**
   *
   * @param {METHODS} methodName
   * @param {string} hash
   * @returns {void}
   */
  static remove(methodName, hash) {
    return LS.remove(methodName, hash);
  }
}
