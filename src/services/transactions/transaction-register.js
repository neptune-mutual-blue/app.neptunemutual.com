import { METHODS } from "@/src/services/transactions/const";
import { LSHistory } from "@/src/services/transactions/history";
import { LSTransaction } from "@/src/services/transactions/transaction";
import {
  STATUS,
  TransactionHistory,
} from "@/src/services/transactions/transaction-history";

/**
 * @typedef {import('./transaction').ISTATE_VALUE} ISTATE_VALUE
 */

const noop = () => {};

export class TransactionRegister {
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
        .catch(() => {
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
    const items = LSTransaction.get();
    return items.reduce((promise, item) => {
      return promise.then(() =>
        callback(item).finally(() => {
          LSTransaction.remove(item.hash);
        })
      );
    }, Promise.resolve());
  }

  /**
   * @typedef AddItem
   * @prop {string} hash
   * @prop {import('@/src/services/transactions/const').E_METHODS} methodName
   * @prop {any} [data]
   *
   * @returns {void}
   *
   * @param {AddItem} item
   */
  static add(item) {
    const _item = Object.assign({}, { ...item, timestamp: Date.now() });

    LSHistory.add({
      hash: _item.hash,
      methodName: _item.methodName,
      status: STATUS.PENDING,
      timestamp: _item.timestamp,
      data: _item.data,
    });

    return LSTransaction.add(_item);
  }

  /**
   * @param {string} hash
   * @returns {void}
   */
  static remove(hash) {
    return LSTransaction.remove(hash);
  }

  /**
   *
   * @param {string} account
   * @param {string} networkId
   */
  static setUser(account, networkId) {
    LSTransaction.setId(account, networkId);
  }
}
