import { TransactionList } from "@/common/TransactionList";
import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";

describe("Transaction List", () => {
  const onClose = jest.fn(() => {});
  const { initialRender, rerenderFn } = initiateTest(TransactionList, {
    isOpen: true,
    onClose,
    container: document.body,
  });

  beforeEach(() => {
    initialRender();
  });

  test("List is rendered", () => {
    screen.debug();
  });
});
