import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";
import IncidentResolvedCoverPage from "@/src/pages/reporting/[cover_id]/[timestamp]/details";

jest.mock("@/src/modules/reporting/details", () => {
  return {
    ReportingDetailsPage: () => {
      return <div data-testid="reporting-details-page"></div>;
    },
  };
});

describe("IncidentResolvedCoverPage test", () => {
  const { initialRender, rerenderFn } = initiateTest(
    IncidentResolvedCoverPage,
    {},
    () => {
      mockFn.useFetchReport(() => ({
        data: false,
        loading: true,
      }));
    }
  );

  beforeEach(() => {
    initialRender();
  });

  test("should display IncidentResolvedCoverPage with loading text", () => {
    const incident = screen.getByText("loading...");
    expect(incident).toBeInTheDocument();
  });

  test("should display IncidentResolvedCoverPage with No data found text", () => {
    rerenderFn({}, () => {
      mockFn.useFetchReport(() => ({
        data: { incidentReport: false },
        loading: false,
      }));
    });
    const incident = screen.getByText("No data found");
    expect(incident).toBeInTheDocument();
  });

  test("should display IncidentResolvedCoverPage with ReportingDetailsPage Component", () => {
    rerenderFn({}, () => {
      mockFn.useFetchReport(() => ({
        data: { incidentReport: true },
        loading: false,
      }));
    });

    const reporting = screen.getByTestId("reporting-details-page");
    expect(reporting).toBeInTheDocument();
  });

  test("Should display coming soon", () => {
    rerenderFn({ disabled: true });
    const comingSoon = screen.getByText("Coming soon!");
    expect(comingSoon).toBeInTheDocument();
  });
});
