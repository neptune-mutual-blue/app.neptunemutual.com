import { PercentDoughnutChart } from "@/common/PercentDoughnutChart";
import { testData } from "@/utils/unit-tests/test-data";
import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";

jest.mock("react-chartjs-2", () => ({
  Doughnut: (p) => mockFn.chartMockFn(p),
}));

const props = testData.doughnutChart;
describe("Banner test", () => {
  const { initialRender } = initiateTest(PercentDoughnutChart, props);

  beforeEach(() => {
    initialRender();
  });

  test("should render the main component", () => {
    const wrapper = screen.getByTestId("percent-doughnut-chart");
    expect(wrapper).toBeInTheDocument();
  });
});
