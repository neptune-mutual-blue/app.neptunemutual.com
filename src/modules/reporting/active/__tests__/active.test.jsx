import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { fireEvent, screen } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { ReportingActivePage } from "@/modules/reporting/active/active";

const activeReportings = {
  data: {
    incidentReports: [
      {
        id: "0x616e696d617465642d6272616e64730000000000000000000000000000000000-0x0000000000000000000000000000000000000000000000000000000000000000-1661401286",
        coverKey:
          "0x616e696d617465642d6272616e64730000000000000000000000000000000000",
        productKey:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        incidentDate: "1661401286",
        resolutionDeadline: "0",
        resolved: false,
        finalized: false,
        status: "Reporting",
        resolutionTimestamp: "1661403086",
      },
      {
        id: "0x6465666900000000000000000000000000000000000000000000000000000000-0x31696e6368000000000000000000000000000000000000000000000000000000-1661159947",
        coverKey:
          "0x6465666900000000000000000000000000000000000000000000000000000000",
        productKey:
          "0x31696e6368000000000000000000000000000000000000000000000000000000",
        incidentDate: "1661159947",
        resolutionDeadline: "0",
        resolved: false,
        finalized: false,
        status: "Reporting",
        resolutionTimestamp: "1661160247",
      },
      {
        id: "0x6262382d65786368616e67650000000000000000000000000000000000000000-0x0000000000000000000000000000000000000000000000000000000000000000-1660893112",
        coverKey:
          "0x6262382d65786368616e67650000000000000000000000000000000000000000",
        productKey:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        incidentDate: "1660893112",
        resolutionDeadline: "0",
        resolved: false,
        finalized: false,
        status: "Reporting",
        resolutionTimestamp: "1660894912",
      },
    ],
  },
};

describe("ReportingActivePage test", () => {
  const { initialRender, rerenderFn } = initiateTest(ReportingActivePage);

  beforeEach(() => {
    i18n.activate("en");
    mockFn.useNetwork();

    mockFn.useActiveReportings({
      data: activeReportings.data,
    });
    mockFn.useRouter();
    mockFn.useFlattenedCoverProducts();
    mockFn.useFetchCoverStats();
    initialRender();
  });

  test("should render 'SearchAndSort bar", () => {
    const searchBar = screen.getByTestId("search-and-sort-container");
    expect(searchBar).toBeInTheDocument();
  });

  test("should render card skeletons if loading", () => {
    rerenderFn({}, () => {
      mockFn.useActiveReportings({
        data: { incidentReports: [] },
        loading: true,
      });
    });

    const loadingSkeleton = screen.getByTestId(
      "active-reportings-card-skeleton"
    );
    expect(loadingSkeleton).toBeInTheDocument();
  });

  test("should render cards lists", () => {
    const gridList = screen.getByTestId("active-page-grid");
    expect(gridList).toBeInTheDocument();
  });

  test("should set searchValue on search box change", () => {
    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "Anim" } });
  });
});
