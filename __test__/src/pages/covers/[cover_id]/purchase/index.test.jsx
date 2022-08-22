import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";
import CoverPurchaseDetails from "@/src/pages/covers/[cover_id]/purchase/index";

jest.mock("@/src/modules/cover/purchase", () => ({
  CoverPurchaseDetailsPage: () => (
    <div data-testid="cover-purchase-details-page"></div>
  ),
}));

describe("CoverPurchaseDetails test", () => {
  const { initialRender, rerenderFn } = initiateTest(CoverPurchaseDetails);

  beforeEach(() => {
    initialRender();
  });

  test("Should display Cover Purchase Details Page component", () => {
    const newIncidentReportPage = screen.getByTestId(
      "cover-purchase-details-page"
    );
    expect(newIncidentReportPage).toBeInTheDocument();
  });

  test("Should display coming soon", () => {
    rerenderFn({ disabled: true });
    const comingSoon = screen.getByText("Coming soon!");
    expect(comingSoon).toBeInTheDocument();
  });
});
