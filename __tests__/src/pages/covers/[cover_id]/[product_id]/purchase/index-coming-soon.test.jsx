import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";

jest.mock("@/common/ComingSoon", () => ({
  ComingSoon: () => <div data-testid="coming-soon"></div>,
}));

describe("CoverPurchaseDetails test", () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    mockFn.useRouter();
    process.env = { ...OLD_ENV, NEXT_PUBLIC_ENABLE_V2: "false" };
    const CoverPurchaseDetails =
      require("@/src/pages/covers/[cover_id]/[product_id]/purchase/index").default;
    const { initialRender } = initiateTest(CoverPurchaseDetails);
    initialRender();
  });

  test("Should display coming soon", () => {
    const comingSoon = screen.getByTestId("coming-soon");
    expect(comingSoon).toBeInTheDocument();
  });
});
