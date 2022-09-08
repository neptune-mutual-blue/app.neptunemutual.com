import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";
import Bond from "@/src/pages/pools/bond/index";

jest.mock("@/src/modules/pools/PoolsTabs", () => {
  return {
    PoolsTabs: ({ children }) => {
      return <div data-testid="pools-tabs">{children}</div>;
    },
  };
});

jest.mock("@/src/modules/pools/bond", () => () => {
  return <div data-testid="bond-page" />;
});

describe("Bond test", () => {
  const { initialRender, rerenderFn } = initiateTest(Bond);

  beforeEach(() => {
    initialRender();
  });

  test("should display Bond with PoolsTabs and BondPage component", () => {
    const tabs = screen.getByTestId("pools-tabs");
    expect(tabs).toBeInTheDocument();

    const policies = screen.getByTestId("bond-page");
    expect(policies).toBeInTheDocument();
  });

  test("Should display coming soon", () => {
    rerenderFn({ disabled: true });
    const comingSoon = screen.getByText("Coming soon!");
    expect(comingSoon).toBeInTheDocument();
  });
});
