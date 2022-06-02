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
  state;

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
