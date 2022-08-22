import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";
import ReportingNewCoverPage from "@/pages/covers/[cover_id]/[product_id]/new-report/index";

jest.mock("@/modules/reporting/new", () => ({
  NewIncidentReportPage: () => (
    <div data-testid="new-incident-report-page"></div>
  ),
}));

describe("ReportingNewCoverPage test", () => {
  const { initialRender, rerenderFn } = initiateTest(ReportingNewCoverPage);

  beforeEach(() => {
    initialRender();
  });

  test("Should display incident report page", () => {
    const newIncidentReportPage = screen.getByTestId(
      "new-incident-report-page"
    );
    expect(newIncidentReportPage).toBeInTheDocument();
  });

  test("Should display coming soon", () => {
    rerenderFn({ disabled: true });
    const comingSoon = screen.getByText("Coming soon!");
    expect(comingSoon).toBeInTheDocument();
  });
});
