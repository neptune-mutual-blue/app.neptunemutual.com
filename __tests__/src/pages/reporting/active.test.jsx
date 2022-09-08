import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";
import ReportingActive from "@/src/pages/reporting/active";

jest.mock("@/src/modules/reporting/ReportingTabs", () => {
  return {
    ReportingTabs: ({ children }) => {
      return <div data-testid="reporting-tabs">{children}</div>;
    },
  };
});

jest.mock("@/src/modules/reporting/active/active", () => {
  return {
    ReportingActivePage: () => {
      return <div data-testid="reporting-active-page"></div>;
    },
  };
});

describe("ReportingActive test", () => {
  const { initialRender, rerenderFn } = initiateTest(ReportingActive);

  beforeEach(() => {
    initialRender();
  });

  test("should display ReportingActive and ReportingTabs, and ReportingActivePage component", () => {
    const tabs = screen.getByTestId("reporting-tabs");
    expect(tabs).toBeInTheDocument();

    const policies = screen.getByTestId("reporting-active-page");
    expect(policies).toBeInTheDocument();
  });

  test("Should display coming soon", () => {
    rerenderFn({ disabled: true });
    const comingSoon = screen.getByText("Coming soon!");
    expect(comingSoon).toBeInTheDocument();
  });
});
