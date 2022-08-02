import React from "react";
import { render, screen, act, cleanup } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { HomeHero } from "@/modules/home/Hero";
import * as ProtocolHook from "@/src/hooks/useProtocolDayData";
import { convertFromUnits, toBN } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { formatPercent } from "@/utils/formatter/percent";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";

const liquidityTokenDecimals = 6;

const protocolDayData = [
  {
    date: 1649980800,
    totalLiquidity: "42972266000000000000000000",
  },
  {
    date: 1650067200,
    totalLiquidity: "43002586813333333333333335",
  },
  {
    date: 1650153600,
    totalLiquidity: "43005074813333333333333335",
  },
  {
    date: 1650240000,
    totalLiquidity: "43019312813333333333333335",
  },
];

const mockFunction = (file, method, returnData) => {
  jest.spyOn(file, method).mockImplementation(() => returnData);
};

const getChangeData = (data) => {
  if (data && data.length >= 2) {
    const lastSecond = toBN(data[data.length - 2].totalLiquidity);
    const last = toBN(data[data.length - 1].totalLiquidity);

    const diff =
      lastSecond.isGreaterThan(0) &&
      last.minus(lastSecond).dividedBy(lastSecond);
    return {
      last: last.toString(),
      diff: diff && diff.absoluteValue().toString(),
      rise: diff && diff.isGreaterThanOrEqualTo(0),
    };
  } else if (data && data.length == 1) {
    return {
      last: toBN(data[0].totalLiquidity).toString(),
      diff: null,
      rise: false,
    };
  }
};

describe("Hero test", () => {
  const renderer = () => {
    act(() => {
      i18n.activate("en");
    });
    render(<HomeHero />);
  };

  beforeEach(() => {
    i18n.activate("en");

    mockFn.useProtocolDayData();
    mockFn.useRouter();
    mockFn.useFetchHeroStats();

    render(<HomeHero />);
  });

  test("should render the component correctly", () => {
    const wrapper = screen.getByTestId("hero-container");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render TVL info `HomeCard` component", () => {
    const wrapper = screen.getByTestId("tvl-homecard");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render available & reporting info `HomeMainCard` component", () => {
    const wrapper = screen.getByTestId("homemaincard");
    expect(wrapper).toBeInTheDocument();
  });

  test("should have element with `Total Liquidity` text", () => {
    const text = "Total Liquidity";
    const wrapper = screen.getByText(text);
    expect(wrapper).toBeInTheDocument();
  });

  test("should render correct total liquidity value", () => {
    const changeData = getChangeData(protocolDayData);
    const currencyText = formatCurrency(
      convertFromUnits(
        changeData?.last || "0",
        liquidityTokenDecimals
      ).toString(),
      "en"
    ).short;
    const wrapper = screen.getByTestId("changedata-currency");
    expect(wrapper).toHaveTextContent(currencyText);
  });

  test("should render total liquidity info", () => {
    const wrapper = screen.getByTestId("changedata-percent");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render correct change percentage", () => {
    const changeData = getChangeData(protocolDayData);
    const percentText = formatPercent(changeData.diff, "en");
    const wrapper = screen
      .getByTestId("changedata-percent")
      .querySelector("span:nth-child(2)");
    expect(wrapper).toHaveTextContent(percentText);
  });

  test("should render TotalLiquidityChart component", () => {
    const wrapper = screen.getByTestId("liquidity-chart-wrapper");
    expect(wrapper).toBeInTheDocument();
  });

  test("should have class `text-DC2121` and `transform-flip` if changedata.rise is false", () => {
    cleanup();
    mockFunction(ProtocolHook, "useProtocolDayData", {
      data: [
        {
          date: 1649980800,
          totalLiquidity: "42972266000000000000000000",
        },
        {
          date: 1650067200,
          totalLiquidity: "13002586813333333333333335",
        },
      ],
      loading: false,
    });
    renderer();

    const wrapper = screen.getByTestId("changedata-percent");
    expect(wrapper).toHaveClass("text-DC2121");
    expect(wrapper.querySelector("span>svg")).toHaveClass("transform-flip");
  });

  test("should not render the percent data if data lenght is 1", () => {
    cleanup();
    mockFunction(ProtocolHook, "useProtocolDayData", {
      data: [
        {
          date: 1649980800,
          totalLiquidity: "42972266000000000000000000",
        },
      ],
      loading: false,
    });
    renderer();

    const wrapper = screen.queryByTestId("changedata-percent");
    expect(wrapper).toBeNull();
  });
});
