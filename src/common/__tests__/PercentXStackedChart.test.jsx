import { PercentXStackedChart } from "@/common/PercentXStackedChart";
import { testData } from "@/utils/unit-tests/test-data";
import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";

const props = testData.percentXStackedChart;

jest.mock("react-chartjs-2", () => ({
  Bar: (p) => mockFn.chartMockFn(p),
}));

describe("Banner test", () => {
  const { initialRender } = initiateTest(
    PercentXStackedChart,
    props,
    () => {},
    { noProviders: true }
  );

  beforeEach(() => {
    initialRender();
  });

  test("should render the main component", () => {
    const wrapper = screen.getByTestId("percent-x-stacked-chart");
    expect(wrapper).toBeInTheDocument();
  });
});
