import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import HomePage from "@/modules/home/index";
import { screen } from "@testing-library/react";
import { i18n } from "@lingui/core";

describe("Home Page", () => {
  beforeEach(() => {
    i18n.activate("en");

    mockFn.useFetchHeroStats();
    mockFn.useAppConstants();
    mockFn.useProtocolDayData();

    mockFn.useCovers();
    mockFn.useFlattenedCoverProducts();
    mockFn.useSortableStats();

    const { initialRender } = initiateTest(HomePage, {});

    initialRender();
  });

  test("should render the liquidity chart wrapper", () => {
    const liquidityChartWrapper = screen.getByTestId("liquidity-chart-wrapper");
    expect(liquidityChartWrapper).toBeInTheDocument();
  });

  test("should render the available covers container", () => {
    const availableCoversContainer = screen.getByTestId(
      "available-covers-container"
    );
    expect(availableCoversContainer).toBeInTheDocument();
  });
});
