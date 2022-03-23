import React, { useEffect, useRef, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock.src";

import HighchartsExporting from "highcharts/modules/exporting";
import { useProtocolDayData } from "@/src/hooks/useProtocolDayData";
import { convertFromUnits, sort } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";

if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
}

const TotalLiquidityChart = () => {
  const [chartData, setChartData] = useState([]);
  const { data } = useProtocolDayData();
  const chartRef = useRef();

  const yAxisMin =
    (chartData.length >= 2 && sort(chartData.map((x) => x.y))[0]) || 0;

  const chartOptions = {
    xAxis: {
      labels: {
        format: "<span class='font-poppins text-black'>{value:%b %e}</span>",
        useHTML: true,
      },
      crosshair: {
        color: "#4E7DD9",
        dashStyle: "Dash",
      },
      ordinal: false,
      minRange: 24 * 3600 * 1000,
    },
    yAxis: {
      opposite: false,
      labels: {
        formatter: function () {
          const fo =
            this.value === 0
              ? { short: "0" }
              : formatCurrency(this.value, "", true);
          return `<span class='font-poppins text-black'>${fo.short}</span>`;
        },
        useHTML: true,
      },
      gridLineDashStyle: "Dash",
      gridLineColor: "#01052D40",
      gridLineWidth: 0.5,
      min: yAxisMin,
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
      formatter: function () {
        return `<div class='px-2'><p class='font-bold font-poppins text-h6'>${
          formatCurrency(this.y).short
        }</p><p class='text-xs font-poppins'>${Highcharts.dateFormat(
          "%b %e, %H:%S",
          new Date(this.x)
        )} UTC</p></div>`;
      },
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderWidth: 1,
      borderRadius: 15,
      borderColor: "#B0C4DB",
      shadow: {
        offsetX: 1,
        offsetY: 2,
        opacity: 0.05,
      },
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
      maskFill: "rgba(78, 125, 217, 0.2)",
      outlineWidth: 0,
    },
    scrollbar: {
      enabled: false,
    },
  };

  useEffect(() => {
    if (chartRef.current?.chart) {
      chartRef.current.chart.showLoading();
    }
  }, []);

  useEffect(() => {
    if (data) {
      const _chartData = [];
      data.map(({ date, totalLiquidity }) => {
        _chartData.push({
          x: date * 1000,
          y: parseFloat(convertFromUnits(totalLiquidity).toString()),
        });
      });
      _chartData.sort((a, b) => {
        if (a.x > b.x) return 1;
        if (a.x < b.x) return -1;
        else return 0;
      });
      setTimeout(
        () => {
          setChartData(_chartData);
          if (chartRef.current?.chart) {
            chartRef.current.chart.hideLoading();
          }
        },
        chartData.length ? 0 : 500
      );
    }
  }, [data, chartData.length]);

  return (
    <div>
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
