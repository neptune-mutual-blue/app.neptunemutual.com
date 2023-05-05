import { initiateTest } from "@/utils/unit-tests/helpers";
import { screen } from "@testing-library/react";
import MyPoliciesActive from "@/src/pages/my-policies/active";
import { testData } from "@/utils/unit-tests/test-data";

const mockActivitiesData = testData.activePolicies;
jest.mock("@/src/modules/my-policies/PoliciesTabs", () => {
  return {
    PoliciesTabs: ({ children }) => {
      const {
        data: { activePolicies },
        loading,
      } = mockActivitiesData;
      return (
        <div data-testid="policies-tabs">
          {children({ data: activePolicies, loading })}
        </div>
      );
    },
  };
});

jest.mock("@/src/modules/my-policies/active/PoliciesActivePage", () => {
  return {
    PoliciesActivePage: () => {
      return <div data-testid="policies-active-page"></div>;
    },
  };
});

describe("MyPoliciesActive test", () => {
  const { initialRender, rerenderFn } = initiateTest(MyPoliciesActive);

  beforeEach(() => {
    initialRender();
  });

  test("should display MyPoliciesActive and PoliciesTabs component", () => {
    const tabs = screen.getByTestId("policies-tabs");
    expect(tabs).toBeInTheDocument();

    const policies = screen.getByTestId("policies-active-page");
    expect(policies).toBeInTheDocument();
  });

  test("Should display coming soon", () => {
    rerenderFn({ disabled: true });
    const comingSoon = screen.getByText("Coming soon!");
    expect(comingSoon).toBeInTheDocument();
  });
});
