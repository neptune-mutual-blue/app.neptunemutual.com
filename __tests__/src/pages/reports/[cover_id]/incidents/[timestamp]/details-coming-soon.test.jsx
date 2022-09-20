import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";

jest.mock("@/common/ComingSoon", () => ({
  ComingSoon: () => <div data-testid="coming-soon"></div>,
}));

describe("IncidentResolvedCoverPage test", () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    mockFn.useRouter();
    process.env = { ...OLD_ENV, NEXT_PUBLIC_FEATURES: "none" };
    const IncidentResolvedCoverPage =
      require("@/src/pages/reports/[cover_id]/incidents/[timestamp]/details").default;
    const { initialRender } = initiateTest(
      IncidentResolvedCoverPage,
      {},
      () => {
        mockFn.useFetchReport(() => ({
          data: false,
          loading: true,
        }));
      }
    );
    initialRender();
  });

  test("Should display coming soon", () => {
    const comingSoon = screen.getByTestId("coming-soon");
    expect(comingSoon).toBeInTheDocument();
  });
});
