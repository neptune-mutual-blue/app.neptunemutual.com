/**
 * @typedef {string} E_METHODS
 *
 * @enum {E_METHODS}
 */
export const METHODS = {
  CREATE_BOND: "createBond",
  STAKING_DEPOSIT: "deposit",
};

/**
 *
 * @param {string} stringedValue
 * @param {any} defaultValue
 * @returns {any}
 *
 */
const safeParseString = (stringedValue, defaultValue = "") => {
  if (stringedValue) {
    try {
      return JSON.parse(stringedValue);
    } catch (e) {}
  }
  return defaultValue;
};

function getInitialState() {
  /** @type {TSTATE_VALUE} */
  return {
    [METHODS.CREATE_BOND]: [],
  };
}

/**
 * @typedef ISTATE_VALUE
 * @prop {string} hash
 * @prop {object|string|number} [data]
 *
 * @typedef {Object.<string, ISTATE_VALUE[]>} TSTATE_VALUE
 */

const LOCAL_STORAGE_ENTRY = "npmPendingTransactions";

class LocalStorageHandler {
  state = getInitialState();

  init() {
    this.state = safeParseString(
      localStorage.getItem(LOCAL_STORAGE_ENTRY),
      getInitialState()
    );
  }

  #update() {
    localStorage.setItem(LOCAL_STORAGE_ENTRY, JSON.stringify(this.state));
  }

  /**
   * @param {METHODS} methodName
   * @returns {ISTATE_VALUE[]}
   */
  get(methodName) {
    if (this.state.hasOwnProperty(methodName)) {
      this.state[methodName];
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

    this.#update();
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

    this.#update();
  }

  clear() {
    this.state = getInitialState();
  }
}

export const LS = new LocalStorageHandler();
