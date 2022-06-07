import { LSHistory } from "@/src/services/transactions/history";

export const STATUS = {
  PENDING: 2,
  SUCCESS: 1,
  FAILED: 0,
};
export class TransactionHistory {
  static listener = [];

  /**
   * @typedef AddItem
   * @prop {string} hash
   * @prop {import('@/src/services/transactions/const').E_METHODS} methodName
   * @prop {number} status
   * @prop {any} [data]
   *
   *
   * @param {AddItem} item
   */
  static push(item) {
    const itemToUpdate = LSHistory.isExisting(item.hash);

    if (itemToUpdate) {
      const updatedItem = {
        hash: item.hash,
        methodName: item.methodName,
        status: item.status,
        timestamp: itemToUpdate.timestamp,
      };
      LSHistory.update(updatedItem);

      TransactionHistory.emit(updatedItem);

      return;
    }

    LSHistory.add({
      hash: item.hash,
      methodName: item.methodName,
      status: item.status,
      timestamp: Date.now(),
      data: item.data,
    });
  }

  /**
   * @param {AddItem} item
   */
  static emit(item) {
    TransactionHistory.listener.forEach((callback) => callback(item));
  }

  /**
   * @param {(item: AddItem) => void} callback
   */
  static on(callback) {
    TransactionHistory.listener.push(callback);

    return {
      off: () => {
        const index = TransactionHistory.listener.findIndex(
          (cb) => cb === callback
        );

        TransactionHistory.listener.splice(index, 1);
      },
    };
  }
}
