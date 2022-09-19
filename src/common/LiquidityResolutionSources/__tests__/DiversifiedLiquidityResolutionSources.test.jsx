import { DiversifiedLiquidityResolutionSources } from "@/common/LiquidityResolutionSources/DiversifiedLiquidityResolutionSources";
import { testData } from "@/utils/unit-tests/test-data";
import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";

describe("DiversifiedLiquidityResolutionSources component", () => {
  const { initialRender } = initiateTest(
    DiversifiedLiquidityResolutionSources,
    {
      info: testData.liquidityFormsContext.info,
      children: <p>Here is the children</p>,
    },
    () => {
      mockFn.useRouter();
      mockFn.useAppConstants();
      mockFn.useCoverStatsContext();
    }
  );
  beforeEach(() => {
    initialRender();
  });

  test("should render total liquidity", () => {
    const text = screen.getByText(/Total Liquidity/i);
    expect(text).toBeInTheDocument();
  });

  test("should render the children passsed to it", () => {
    const text = screen.getByText(/Here is the children/i);
    expect(text).toBeInTheDocument();
  });
});
