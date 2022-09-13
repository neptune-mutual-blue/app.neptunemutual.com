import { TransactionList } from "@/common/TransactionList";
import { METHODS } from "@/src/services/transactions/const";
import {
  STATUS,
  TransactionHistory,
} from "@/src/services/transactions/transaction-history";
import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { getActionMessage } from "@/src/helpers/notification";
import { screen, fireEvent } from "@testing-library/react";

const mockItem = {
  hash: "11222331",
  methodName: METHODS.BOND_CREATE,
  status: STATUS.PENDING,
  data: {
    value: "250000000000000000000",
    receiveAmount: "250000000000000000000",
    tokenSymbol: "NPM",
  },
};

const mockTransactionHistoryData = [
  mockItem,
  {
    ...mockItem,
    hash: "11222332",
    status: STATUS.SUCCESS,
    timestamp: Date.now() + 1000,
  },
  {
    ...mockItem,
    hash: "11222333",
    status: STATUS.FAILED,
  },
  {
    ...mockItem,
    hash: "21222331",
    status: STATUS.PENDING,
    methodName: METHODS.BOND_APPROVE,
  },
  {
    ...mockItem,
    hash: "21222332",
    status: STATUS.SUCCESS,
    methodName: METHODS.BOND_APPROVE,
  },
  {
    ...mockItem,
    hash: "21222333",
    status: STATUS.FAILED,
    methodName: METHODS.BOND_APPROVE,
  },
  {
    ...mockItem,
    hash: "31222331",
    status: STATUS.PENDING,
    methodName: METHODS.BOND_CLAIM,
  },
  {
    ...mockItem,
    hash: "31222332",
    status: STATUS.SUCCESS,
    methodName: METHODS.BOND_CLAIM,
  },
  {
    ...mockItem,
    hash: "31222333",
    status: STATUS.FAILED,
    methodName: METHODS.BOND_CLAIM,
  },
];

const addItems = (count = mockTransactionHistoryData.length) => {
  mockTransactionHistoryData.slice(0, count).forEach(TransactionHistory.push);
};

const getInfoOfItem = (index) => {
  const item = mockTransactionHistoryData[index];
  if (item) {
    return getActionMessage(item.methodName, item.status, { ...item }, "en");
  }

  return getInfoOfItem(0);
};

describe("Transaction List", () => {
  const onClose = jest.fn(() => {});
  const { initialRender, rerenderFn } = initiateTest(TransactionList, {
    isOpen: true,
    onClose,
    container: document.body,
  });

  describe("No data", () => {
    beforeEach(() => {
      initialRender();
    });

    test("List is hidden", () => {
      rerenderFn({ isOpen: false });

      const placeholder = screen.queryByText("No transaction history to show");
      const viewMore = screen.queryByText("View More");

      expect(placeholder).not.toBeInTheDocument();
      expect(viewMore).not.toBeInTheDocument();
    });

    test("List is rendered with NO transaction history", () => {
      rerenderFn();

      const placeholder = screen.getByText("No transaction history to show");
      const viewMore = screen.getByText("View More");

      expect(placeholder).toBeInTheDocument();
      expect(viewMore).toBeInTheDocument();
      expect(viewMore.parentElement).toHaveClass("hidden");
    });
  });

  describe("with 3 Data", () => {
    beforeEach(() => {
      addItems(1);
      initialRender();
    });

    test("List is rendered with 3 transaction history", () => {
      rerenderFn();

      const placeholder = screen.queryByText("No transaction history to show");
      const viewMore = screen.getByText("View More");

      expect(placeholder).not.toBeInTheDocument();
      expect(viewMore).toBeInTheDocument();
      expect(viewMore.parentElement).toHaveClass("hidden");

      const first = getInfoOfItem(0);

      expect(first).toBeTruthy();

      const firstItem = screen.getByText(first.title);
      expect(firstItem).toBeInTheDocument();

      const amount = screen.getByText("250 NPM");
      expect(amount).toBeInTheDocument();

      const justNow = screen.getByText("just now");
      expect(justNow).toBeInTheDocument();

      const gt = screen.getByText(/View Tx/i);
      expect(gt).toBeInTheDocument();
    });
  });

  describe("with All Data", () => {
    beforeEach(() => {
      addItems();
      initialRender();
    });

    test("List is rendered with transaction history", () => {
      rerenderFn();

      const placeholder = screen.queryByText("No transaction history to show");
      const viewMore = screen.getByText("View More");

      expect(placeholder).not.toBeInTheDocument();
      expect(viewMore).toBeInTheDocument();
      expect(viewMore.parentElement).not.toHaveClass("hidden");

      const items = screen.getAllByTestId("notification-item");

      expect(items.length).toBe(6);

      fireEvent.click(viewMore);
      const moreItems = screen.getAllByTestId("notification-item");

      expect(moreItems.length).toBe(9);
    });
  });
});
