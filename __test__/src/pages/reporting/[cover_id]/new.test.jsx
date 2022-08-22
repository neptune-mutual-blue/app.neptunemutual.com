import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";
import ReportingNewCoverPage from "@/src/pages/reporting/[cover_id]/new";

jest.mock("@/modules/reporting/new", () => {
  return {
    NewIncidentReportPage: () => {
      return <div data-testid="new-incident-report-page"></div>;
    },
  };
});

describe("ReportingNewCoverPage test", () => {
  const { initialRender, rerenderFn } = initiateTest(ReportingNewCoverPage);

  beforeEach(() => {
    initialRender();
  });

  test("should display ReportingNewCoverPage with NewIncidentReportPage component", () => {
    const incident = screen.getByTestId("new-incident-report-page");
    expect(incident).toBeInTheDocument();
  });

  test("Should display coming soon", () => {
    rerenderFn({ disabled: true });
    const comingSoon = screen.getByText("Coming soon!");
    expect(comingSoon).toBeInTheDocument();
  });
});
