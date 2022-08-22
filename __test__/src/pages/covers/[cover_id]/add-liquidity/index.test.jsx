import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";
import CoverAddLiquidityDetails from "@/src/pages/covers/[cover_id]/add-liquidity/index";

jest.mock("@/src/modules/cover/add-liquidity", () => ({
  CoverAddLiquidityDetailsPage: () => (
    <div data-testid="cover-add-liquidity-details-page"></div>
  ),
}));

describe("CoverAddLiquidityDetails test", () => {
  const { initialRender, rerenderFn } = initiateTest(CoverAddLiquidityDetails);

  beforeEach(() => {
    initialRender();
  });

  test("Should display incident report page", () => {
    const newIncidentReportPage = screen.getByTestId(
      "cover-add-liquidity-details-page"
    );
    expect(newIncidentReportPage).toBeInTheDocument();
  });

  test("Should display coming soon", () => {
    rerenderFn({ disabled: true });
    const comingSoon = screen.getByText("Coming soon!");
    expect(comingSoon).toBeInTheDocument();
  });
});
