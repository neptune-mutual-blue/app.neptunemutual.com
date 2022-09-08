import { mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { screen, render } from "@testing-library/react";

jest.mock("@/src/modules/cover/add-liquidity", () => ({
  CoverAddLiquidityDetailsPage: () => (
    <div data-testid="cover-add-liquidity-details-page"></div>
  ),
}));

describe("CoverAddLiquidityDetails test", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    mockFn.useRouter();
    process.env = { ...OLD_ENV, NEXT_PUBLIC_FEATURES: "liquidity" };

    const CoverPurchaseDetails =
      require("@/src/pages/covers/[cover_id]/add-liquidity/index").default;
    render(<CoverPurchaseDetails />);
  });

  test("Should display incident report page", () => {
    const newIncidentReportPage = screen.getByTestId(
      "cover-add-liquidity-details-page"
    );
    expect(newIncidentReportPage).toBeInTheDocument();
  });
});
