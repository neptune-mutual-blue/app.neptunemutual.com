import { TotalLiquidityChart } from "@/common/TotalLiquidityChart";
// import { testData } from "@/utils/unit-tests/test-data";
import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";

describe("TotalLiquidityChart", () => {
  const { initialRender, rerenderFn } = initiateTest(
    TotalLiquidityChart,
    {},
    () => {
      mockFn.useAppConstants();
      mockFn.useProtocolDayData();
      mockFn.useRouter();
    }
  );

  beforeEach(() => {
    initialRender();
  });

  test("should render the main wrapper", () => {
    const wrapper = screen.getByTestId("total-liquidity-chart");
    expect(wrapper).toBeInTheDocument();
  });

  test("simulating with no data", () => {
    rerenderFn({}, () => {
      mockFn.useProtocolDayData(() => ({ data: null, loading: false }));
    });
    const wrapper = screen.getByTestId("total-liquidity-chart");
    expect(wrapper).toBeInTheDocument();
  });

  // test("simulating with 2 data points", () => {
  //   rerenderFn({}, () => {
  //     mockFn.useProtocolDayData(() => ({
  //       data: testData.protocolDayData.data.slice(0, 2),
  //       loading: false,
  //     }));
  //   });
  //   const wrapper = screen.getByTestId("total-liquidity-chart");
  //   expect(wrapper).toBeInTheDocument();
  // });
});
