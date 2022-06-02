import {
  LocalStorageInstance,
  LOCAL_STORAGE_ENTRY,
} from "@/src/services/transactions/instance";
import { safeParseString } from "@/src/services/transactions/utils";

/**
 *
 * @typedef IHistoryEntry
 * @prop {string} hash
 * @prop {import('@/src/services/transactions/const').E_METHODS} methodName
 * @prop {number} timestamp
 * @prop {number} status 0 - failure | 1 - success | pending - 2
 * @prop {object} [data]
 */

const MAX_TRANSACTION_HISTORY = 100;
class LSHistoryClass extends LocalStorageInstance {
  key = LOCAL_STORAGE_ENTRY.TRANSACTION_HISTORY;
  state = [];

  init() {
    this.state = safeParseString(localStorage.getItem(this.key), []);
  }

  /**
   * @param {IHistoryEntry} item
   */
  add(item) {
    this.state = [...this.state, item].slice(-MAX_TRANSACTION_HISTORY);

    this._update();
  }

  /**
   *
   * @param {number} [page]
   * @param {number} [offset]
   * @returns
   */
  get(page = 1, offset = 6) {
    const start = page - 1;
    return this.state.slice(start, offset * page);
  }

  clear() {
    this.state = [];

    this._update();
  }
}

export const LSHistory = new LSHistoryClass();
