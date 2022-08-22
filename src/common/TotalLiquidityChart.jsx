import React, { useEffect, useRef, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock.src";

import HighchartsExporting from "highcharts/modules/exporting";
import { convertFromUnits, sort } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { useRouter } from "next/router";
import { useAppConstants } from "@/src/context/AppConstants";

if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
}

const TotalLiquidityChart = ({ data }) => {
  const { liquidityTokenDecimals } = useAppConstants();

  const [chartData, setChartData] = useState([]);
  const chartRef = useRef();
  const router = useRouter();

  const yAxisMin =
    (chartData.length >= 2 && sort(chartData.map((x) => x.y))[0]) || 0;

  const chartOptions = {
    xAxis: {
      labels: {
        format:
          "<span class='font-poppins text-black uppercase'>{value:%b %e}</span>",
        useHTML: true,
      },
      crosshair: {
        color: "#4E7DD9",
        dashStyle: "Dash",
      },
      ordinal: false,
      minRange: 1 * 24 * 3600 * 1000,
      lineWidth: 0.5,
      lineColor: "#01052D",
    },
    yAxis: {
      opposite: false,
      labels: {
        formatter: function () {
          const fo =
            this.value === 0
              ? { short: "0" }
              : formatCurrency(this.value, router.locale, "", true);
          return `<span class='font-poppins text-black'>${fo.short}</span>`;
        },
        useHTML: true,
      },
      gridLineDashStyle: "Dash",
      gridLineColor: "#01052D40",
      gridLineWidth: 0.5,
      min: yAxisMin,
      lineWidth: 0.5,
      lineColor: "#01052D",
    },
    series: [
      {
        type: "areaspline",
        name: "Total Liquidity Chart",
        data: chartData,
        lineWidth: 3,
        lineColor: "#4E7DD9",
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, "rgba(78, 125, 217, 0.4)"],
            [1, "rgba(78, 125, 217, 0.05)"],
          ],
        },
        marker: {
          fillColor: "white",
          lineWidth: 2,
          radius: 3,
          lineColor: "#4E7DD9",
        },
        animation: {
          duration: 500,
        },
      },
    ],
    chart: {
      backgroundColor: "transparent",
    },
    navigation: {
      buttonOptions: {
        enabled: false,
      },
    },
    rangeSelector: { enabled: false },
    credits: { enabled: false },
    tooltip: {
      animation: true,
      xDateFormat: false,
      useHTML: true,
      padding: 0,
      formatter: function () {
        return `<div class='px-4 pr-6 py-3 bg-white bg-opacity-95 rounded-tooltip border border-B0C4DB shadow-hc-tooltip'><p class='font-semibold font-poppins tracking-normal text-01052D text-h6'>${
          formatCurrency(this.y, router.locale).short
        }</p><p class='text-xs leading-4.5 tracking-normal font-poppins font-semibold text-5C738F uppercase'>${Highcharts.dateFormat(
          "%b %e, %H:%S",
          new Date(this.x).getTime()
        )} UTC</p></div>`;
      },
      backgroundColor: "rgba(255, 255, 255, 0)",
      borderWidth: 0,
      // borderRadius: 15,
      // borderColor: "#B0C4DB",
      shadow: false,
      shape: "rect",
      // split: true,
      hideDelay: 100,
      outside: false,
    },
    navigator: {
      handles: {
        symbols: [
          "url(/icons/chart-navigator-handle.svg)",
          "url(/icons/chart-navigator-handle.svg)",
        ],
        lineWidth: 1,
        width: 20,
        height: 30,
      },
      maskFill: "rgba(66, 137, 242, 0.3)",
      outlineWidth: 0,
      xAxis: {
        // tickInterval: 1 * 24 * 3600 * 1000,
        labels: {
          format:
            "<span class='font-poppins text-black uppercase'>{value:%b %e}</span>",
          useHTML: true,
          style: {
            color: "#01052D",
          },
          align: "center",
          y: 14,
        },
      },
    },
    scrollbar: {
      enabled: false,
    },
  };

  useEffect(() => {
    if (chartRef.current && chartRef?.current?.chart) {
      chartRef.current?.chart?.showLoading();
    }
  }, []);

  useEffect(() => {
    let chartDataTimeout;

    if (data) {
      const _chartData = [];
      data.map(({ date, totalLiquidity }) => {
        _chartData.push({
          x: date * 1000,
          y: parseFloat(
            convertFromUnits(totalLiquidity, liquidityTokenDecimals).toString()
          ),
        });
      });
      _chartData.sort((a, b) => {
        if (a.x > b.x) return 1;
        if (a.x < b.x) return -1;
        else return 0;
      });

      chartDataTimeout = setTimeout(
        () => {
          setChartData(_chartData);
          if (chartRef.current?.chart) {
            chartRef.current.chart.hideLoading();
          }
        },
        chartData.length ? 0 : 500
      );
    }

    return () => {
      clearTimeout(chartDataTimeout);
    };
  }, [data, chartData.length, liquidityTokenDecimals]);

  return (
    <div data-testid="total-liquidity-chart">
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        constructorType="stockChart"
        ref={chartRef}
      />
    </div>
  );
};

export { TotalLiquidityChart };
