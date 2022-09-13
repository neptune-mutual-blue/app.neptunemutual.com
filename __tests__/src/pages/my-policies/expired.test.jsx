import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";
import MyPoliciesExpired from "@/src/pages/my-policies/expired";

jest.mock("@/src/modules/my-policies/PoliciesTabs", () => {
  return {
    PoliciesTabs: ({ children }) => {
      return (
        <div data-testid="policies-tabs">
          {children({ data: [], loading: false })}
        </div>
      );
    },
  };
});

jest.mock("@/src/modules/my-policies/expired/PoliciesExpiredPage", () => {
  return {
    PoliciesExpiredPage: () => {
      return <div data-testid="policies-expired-page"></div>;
    },
  };
});

describe("MyPoliciesExpired test", () => {
  const { initialRender, rerenderFn } = initiateTest(MyPoliciesExpired);

  beforeEach(() => {
    initialRender();
  });

  test("should display MyPoliciesExpired and PoliciesTabs component", () => {
    const tabs = screen.getByTestId("policies-tabs");
    expect(tabs).toBeInTheDocument();

    const policies = screen.getByTestId("policies-expired-page");
    expect(policies).toBeInTheDocument();
  });

  test("Should display coming soon", () => {
    rerenderFn({ disabled: true });
    const comingSoon = screen.getByText("Coming soon!");
    expect(comingSoon).toBeInTheDocument();
  });
});
