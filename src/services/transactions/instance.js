/** @typedef {string} E_LOCAL_STORAGE_ENTRY */
export const LOCAL_STORAGE_ENTRY = {
  PENDING_TRANSACTIONS: "npmPendingTransactions",
  TRANSACTION_HISTORY: "npmTransactionHistory",
};

export class LocalStorageInstance {
  /**
   * @prop {E_LOCAL_STORAGE_ENTRY} key
   */
  key = "";
  id = "";
  /**
   * @typedef {Object.<string, any[]>} STATE_ENTRY
   *
   * @type STATE_ENTRY
   */
  state;

  /**
   *
   * @param {string} account
   * @param {string} networkId
   */
  setId(account, networkId) {
    this.id = `${account}:${networkId}`;

    if (!this.state.hasOwnProperty(this.id)) {
      this.state[this.id] = [];
    }

    this._update();
  }

  _update() {
    localStorage.setItem(this.key, JSON.stringify(this.state));
  }

  // methods to extend
  init() {}
  /**
  add() {}
  remove() {}
  get() {}
  clear() {}
   */
}
