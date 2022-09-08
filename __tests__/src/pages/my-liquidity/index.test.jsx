import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";
import MyLiquidity from "@/src/pages/my-liquidity/index";

jest.mock("@/common/Hero", () => ({
  Hero: () => {
    return <div data-testid="hero"></div>;
  },
}));

jest.mock("@/modules/my-liquidity", () => ({
  MyLiquidityPage: () => {
    return <div data-testid="my-liquidity-page"></div>;
  },
}));

describe("MyLiquidity test", () => {
  const { initialRender, rerenderFn } = initiateTest(MyLiquidity, {}, () => {
    mockFn.useCalculateLiquidity();
    mockFn.useCalculateTotalLiquidity();
    mockFn.useAppConstants();
    mockFn.useWeb3React();
    mockFn.useMyLiquidities();
  });

  beforeEach(() => {
    initialRender();
  });

  test("should display MyLiquidity with Hero and MyLiquidityPage component", () => {
    const hero = screen.getByTestId("hero");
    expect(hero).toBeInTheDocument();

    const myLiquidityPage = screen.getByTestId("my-liquidity-page");
    expect(myLiquidityPage).toBeInTheDocument();
  });

  test("Should display coming soon", () => {
    rerenderFn({ disabled: true });
    const comingSoon = screen.getByText("Coming soon!");
    expect(comingSoon).toBeInTheDocument();
  });
});
