import {
  globalFn,
  initiateTest,
  mockFn,
} from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { ActiveReportSummary } from "@/modules/reporting/active/ActiveReportSummary";
import { testData } from "@/utils/unit-tests/test-data";

const refetchReport = jest.fn();
const refetchInfo = jest.fn();
const incidentReport = testData.incidentReports.data.incidentReport;
const info = testData.consensusInfo.info;

describe("ActiveReportSummary test", () => {
  const { initialRender, rerenderFn } = initiateTest(ActiveReportSummary, {
    refetchInfo: refetchInfo,
    refetchReport: refetchReport,
    incidentReport: incidentReport,
    resolvableTill: incidentReport.resolutionDeadline,
    yes: info.yes,
    no: info.no,
    myYes: info.myYes,
    myNo: info.myNo,
  });

  beforeEach(() => {
    i18n.activate("en");
    mockFn.useRouter();
    mockFn.useAppConstants();
    globalFn.DOMRect();
    globalFn.resizeObserver();
    initialRender();
  });

  test("should render 'SearchAndSort bar", () => {
    const reportSummaryText = screen.getByText(/Report Summary/i);
    expect(reportSummaryText).toBeInTheDocument();
  });

  test("should do something if decision is null", () => {
    rerenderFn({
      refetchInfo: refetchInfo,
      refetchReport: refetchReport,
      incidentReport: { ...incidentReport, decision: null },
      resolvableTill: incidentReport.resolutionDeadline,
      yes: info.yes,
      no: info.no,
      myYes: info.myYes,
      myNo: info.myNo,
    });
    const table = screen.getAllByRole("table");
    expect(table.length).toBe(2);
  });
});
