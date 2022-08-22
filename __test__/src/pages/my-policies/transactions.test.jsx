import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";
import MyPoliciesTxs from "@/src/pages/my-policies/transactions";

jest.mock("@/src/modules/my-policies/MyPoliciesTxsTable", () => {
  return {
    MyPoliciesTxsTable: () => {
      return <div data-testid="policies-txs-table"></div>;
    },
  };
});

jest.mock("@/common/Hero", () => ({
  Hero: () => {
    return <div data-testid="hero"></div>;
  },
}));

describe("MyPoliciesTxs test", () => {
  const { initialRender, rerenderFn } = initiateTest(MyPoliciesTxs);

  beforeEach(() => {
    initialRender();
  });

  test("should display MyPoliciesTxs with Hero and MyPoliciesTxsTable component", () => {
    const hero = screen.getByTestId("hero");
    expect(hero).toBeInTheDocument();

    const policies = screen.getByTestId("policies-txs-table");
    expect(policies).toBeInTheDocument();
  });

  test("Should display coming soon", () => {
    rerenderFn({ disabled: true });
    const comingSoon = screen.getByText("Coming soon!");
    expect(comingSoon).toBeInTheDocument();
  });
});
