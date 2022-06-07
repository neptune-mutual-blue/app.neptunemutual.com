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
 *
 *
 * @typedef {Object.<string, IHistoryEntry[]>} THistory
 */

const MAX_TRANSACTION_HISTORY = 100;
class LSHistoryClass extends LocalStorageInstance {
  key = LOCAL_STORAGE_ENTRY.TRANSACTION_HISTORY;
  /** @type THistory */
  state = {};

  init() {
    const result = safeParseString(localStorage.getItem(this.key), {});

    this.state = result;
  }

  /**
   * @param {string} hash
   *
   * @returns {IHistoryEntry | false | undefined}
   */
  isExisting(hash) {
    if (this.state.hasOwnProperty(this.id)) {
      const item = this.state[this.id].find((item) => item.hash === hash);

      return item;
    }

    this.state[this.id] = [];
    return false;
  }

  /**
   * @param {IHistoryEntry} item
   */
  add(item) {
    if (this.state.hasOwnProperty(this.id)) {
      this.state[this.id] = [item, ...this.state[this.id]].slice(
        0,
        MAX_TRANSACTION_HISTORY
      );
    }

    this._update();
  }

  /**
   * @param {IHistoryEntry} item
   */
  update(item) {
    if (this.state.hasOwnProperty(this.id)) {
      const itemToUpdate = this.state[this.id].find(
        ({ hash }) => item.hash === hash
      );

      itemToUpdate.status = item.status;
    }

    this._update();
  }

  /**
   *
   * @param {number} [page]
   * @param {number} [offset]
   * @returns
   */
  get(page = 1, offset = 6) {
    if (this.state.hasOwnProperty(this.id)) {
      const list = this.state[this.id];
      const data = list.slice((page - 1) * offset, page * offset);

      return {
        data,
        maxPage: Math.ceil(list.length / offset),
      };
    }
    return {
      data: [],
      maxPage: 1,
    };
  }

  clear() {
    if (this.state.hasOwnProperty(this.id)) {
      this.state[this.id] = [];
    }

    this._update();
  }
}

export const LSHistory = new LSHistoryClass();
