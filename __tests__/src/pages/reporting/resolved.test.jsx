import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";
import ReportingResolved from "@/src/pages/reporting/resolved";

jest.mock("@/src/modules/reporting/ReportingTabs", () => {
  return {
    ReportingTabs: ({ children }) => {
      return <div data-testid="reporting-tabs">{children}</div>;
    },
  };
});

jest.mock("@/src/modules/reporting/resolved/resolved", () => {
  return {
    ReportingResolvedPage: () => {
      return <div data-testid="reporting-resolved-page"></div>;
    },
  };
});

describe("ReportingResolved test", () => {
  const { initialRender, rerenderFn } = initiateTest(ReportingResolved);

  beforeEach(() => {
    initialRender();
  });

  test("should display ReportingResolved and ReportingTabs, and ReportingResolvedPage component", () => {
    const tabs = screen.getByTestId("reporting-tabs");
    expect(tabs).toBeInTheDocument();

    const policies = screen.getByTestId("reporting-resolved-page");
    expect(policies).toBeInTheDocument();
  });

  test("Should display coming soon", () => {
    rerenderFn({ disabled: true });
    const comingSoon = screen.getByText("Coming soon!");
    expect(comingSoon).toBeInTheDocument();
  });
});
