import { METHODS } from "@/src/services/transactions/const";
import {
  LocalStorageInstance,
  LOCAL_STORAGE_ENTRY,
} from "@/src/services/transactions/instance";
import { safeParseString } from "@/src/services/transactions/utils";

/**
 *
 * @typedef ISTATE_VALUE
 * @prop {string} hash
 * @prop {object|string|number} [data]
 *
 * @typedef {Object.<string, ISTATE_VALUE[]>} TSTATE_VALUE
 */
function getInitialState() {
  /** @type {TSTATE_VALUE} */
  return {
    [METHODS.CREATE_BOND]: [],
    [METHODS.STAKING_DEPOSIT]: [],
  };
}

class LSTransactionClass extends LocalStorageInstance {
  key = LOCAL_STORAGE_ENTRY.PENDING_TRANSACTIONS;
  state = getInitialState();

  init() {
    Object.assign(
      this.state,
      safeParseString(
        localStorage.getItem(LOCAL_STORAGE_ENTRY.PENDING_TRANSACTIONS),
        getInitialState()
      )
    );
  }
  /**
   * @param {METHODS} methodName
   * @returns {ISTATE_VALUE[]}
   */
  get(methodName) {
    if (this.state.hasOwnProperty(methodName)) {
      return this.state[methodName];
    }

    return [];
  }

  /**
   * @param {METHODS} methodName
   * @param {ISTATE_VALUE} item
   * @returns {void}
   */
  add(methodName, item) {
    if (this.state.hasOwnProperty(methodName)) {
      this.state[methodName].push(item);
    }

    this._update();
  }

  /**
   * @param {METHODS} methodName
   * @param {string} hash
   * @returns {void}
   */
  remove(methodName, hash) {
    if (this.state.hasOwnProperty(methodName)) {
      const index = this.state[methodName].findIndex(
        (item) => item.hash === hash
      );

      if (index !== -1) {
        this.state[methodName].splice(index, 1);
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
