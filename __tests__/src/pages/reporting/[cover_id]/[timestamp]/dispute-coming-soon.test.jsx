import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";

jest.mock("@/common/ComingSoon", () => ({
  ComingSoon: () => <div data-testid="coming-soon"></div>,
}));

describe("DisputeFormPage test", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    mockFn.useRouter();
    process.env = { ...OLD_ENV, NEXT_PUBLIC_FEATURES: "none" };
    const DisputeFormPage =
      require("@/src/pages/reporting/[cover_id]/[timestamp]/dispute").default;

    const { initialRender } = initiateTest(DisputeFormPage, {}, () => {
      mockFn.useCoverOrProductData();
      mockFn.useFetchReport(() => ({
        data: { incidentReport: false },
        loading: true,
      }));
    });
    initialRender();
  });

  test("Should display coming soon", () => {
    const comingSoon = screen.getByTestId("coming-soon");
    expect(comingSoon).toBeInTheDocument();
  });
});
