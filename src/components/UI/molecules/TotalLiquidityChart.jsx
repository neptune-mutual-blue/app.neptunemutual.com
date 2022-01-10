import React, { useRef, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  // registerables
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
  // ...registerables
);

const labels = [
  "Dec 3",
  "Dec 12",
  "Dec 21",
  "Dec 30",
  "Jan 8",
  "Jan 17",
  "Jan 26",
];

export const data = {
  labels,
  datasets: [
    {
      data: [50, 100, 130, 200, 230, 260, 400],
      tension: "0.4",
      borderColor: "#4E7DD9",
      fill: true,
    },
  ],
};

const options = {
  elements: {
    point: {
      radius: 0,
    },
  },
  plugins: {
    // ChartsJS DataLabels initialized here
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      ticks: {
        color: "#01052D",
        font: {
          size: "11",
        },
        callback: function (value, index) {
          return this.getLabelForValue(value) + "M";
        },
      },
      grid: {
        display: false,
      },
    },
    x: {
      ticks: {
        color: "01052D",
        font: {
          size: "11",
        },
      },
      grid: {
        display: false,
      },
    },
  },
};

function createGradient(ctx, area) {
  const colorStart = "#020845";
  const colorEnd = "#000C84";

  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(0.5521, colorEnd);

  return gradient;
}

export function TotalLiquidityChart() {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    const chartData = {
      ...data,
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        backgroundColor: createGradient(chart.ctx, chart.chartArea),
      })),
    };

    setChartData(chartData);
  }, []);

  return (
    <Chart ref={chartRef} type="line" options={options} data={chartData} />
  );
}
