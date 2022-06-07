import {
  LocalStorageInstance,
  LOCAL_STORAGE_ENTRY,
} from "@/src/services/transactions/instance";
import { safeParseString } from "@/src/services/transactions/utils";

/**
 *
 * @typedef ISTATE_VALUE
 * @prop {string} hash
 * @prop {import('@/src/services/transactions/const').E_METHODS} methodName
 * @prop {number} timestamp
 * @prop {object|string|number} [data]
 *
 * @typedef {Object.<string, ISTATE_VALUE[]>} TSTATE_VALUE
 */
function getInitialState() {
  /** @type {TSTATE_VALUE} */
  return {};
}

class LSTransactionClass extends LocalStorageInstance {
  key = LOCAL_STORAGE_ENTRY.PENDING_TRANSACTIONS;
  state = getInitialState();

  init() {
    Object.assign(
      this.state,
      safeParseString(localStorage.getItem(this.key), getInitialState())
    );
  }

  /**
   * @returns {ISTATE_VALUE[]}
   */
  get() {
    if (this.state.hasOwnProperty(this.id)) {
      return this.state[this.id];
    }

    return [];
  }

  /**
   * @param {ISTATE_VALUE} item
   * @returns {void}
   */
  add(item) {
    if (this.state.hasOwnProperty(this.id)) {
      this.state[this.id].push(item);
    }

    this._update();
  }

  /**
   * @param {string} hash
   * @returns {void}
   */
  remove(hash) {
    if (this.state.hasOwnProperty(this.id)) {
      const index = this.state[this.id].findIndex((item) => item.hash === hash);

      if (index !== -1) {
        this.state[this.id].splice(index, 1);
      }
    }

    this._update();
  }

  clear() {
    this.state = getInitialState();
    this._update();
  }
}

export const LSTransaction = new LSTransactionClass();
