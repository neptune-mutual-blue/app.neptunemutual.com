import { LSHistory } from "@/src/services/transactions/history";
import { LSTransaction } from "@/src/services/transactions/transaction";

export class LS {
  static init() {
    LSHistory.init();
    LSTransaction.init();
  }

  /**
   *
   * @param {string} account
   * @param {string} networkId
   */
  static setId(account, networkId) {
    LSHistory.setId(account, networkId);
    LSTransaction.setId(account, networkId);
  }
}
