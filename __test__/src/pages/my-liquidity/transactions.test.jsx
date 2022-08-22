import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";
import MyLiquidityTxs from "@/src/pages/my-liquidity/transactions";

jest.mock("@/src/modules/my-liquidity/MyLiquidityTxsTable", () => {
  return {
    MyLiquidityTxsTable: () => {
      return <div data-testid="liquidity-txs-table"></div>;
    },
  };
});

jest.mock("@/common/Hero", () => ({
  Hero: () => {
    return <div data-testid="hero"></div>;
  },
}));

describe("MyLiquidityTxs test", () => {
  const { initialRender, rerenderFn } = initiateTest(MyLiquidityTxs);

  beforeEach(() => {
    initialRender();
  });

  test("should display MyLiquidityTxs with Hero and MyLiquidityTxsTable component", () => {
    const hero = screen.getByTestId("hero");
    expect(hero).toBeInTheDocument();

    const myLiquidityPage = screen.getByTestId("liquidity-txs-table");
    expect(myLiquidityPage).toBeInTheDocument();
  });

  test("Should display coming soon", () => {
    rerenderFn({ disabled: true });
    const comingSoon = screen.getByText("Coming soon!");
    expect(comingSoon).toBeInTheDocument();
  });
});
