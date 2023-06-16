import { initiateTest } from "@/utils/unit-tests/helpers";
import { screen } from "@testing-library/react";
import MyBondTxs from "@/src/pages/pools/bond/transactions";

jest.mock("@/src/modules/pools/bond/MyBondTxsTable", () => {
  return {
    MyBondTxsTable: () => {
      return <div data-testid="my-bond-txs-table"></div>;
    },
  };
});

describe("MyBondTxs test", () => {
  const { initialRender, rerenderFn } = initiateTest(MyBondTxs);

  beforeEach(() => {
    initialRender();
  });

  test("should display MyBondTxs with MyBondTxsTable", () => {
    const bond = screen.getByTestId("my-bond-txs-table");
    expect(bond).toBeInTheDocument();
  });

  test("Should display coming soon", () => {
    rerenderFn({ disabled: true });
    const comingSoon = screen.getByText("Coming soon!");
    expect(comingSoon).toBeInTheDocument();
  });
});
