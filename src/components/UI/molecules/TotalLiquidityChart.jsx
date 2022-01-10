import React, { useRef, useEffect, useState, Fragment } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  defaults,
  // registerables
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { Container } from "@/src/components/UI/atoms/container";

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

Tooltip.positioners.myCustomPositioner = function (elements, eventPosition) {
  // A reference to the tooltip model
  const tooltip = this;

  /* ... */
  console.log(eventPosition);

  return {
    x: eventPosition.x,
    y: eventPosition.y,
    // You may also include xAlign and yAlign to override those tooltip options.
  };
};

const labels = [
  "Dec 3",
  "Dec 12",
  "Dec 21",
  "Dec 30",
  "Jan 8",
  "Jan 17",
  "Jan 26",
];

const footer = (tooltipItems) => {
  return (
    <div className="px-3 py-5 border bg-red flex">
      {tooltipItems.map((t, idx) => {
        console.log(t.parsed.x);
        return (
          <Fragment key={idx}>
            {/* <span>{t.parsed.x}</span>
            <span>{t.parsed.y}</span> */}
            <p>asdf</p>
          </Fragment>
        );
      })}
    </div>
  );
};

export const data = {
  labels,
  datasets: [
    {
      data: [50, 100, 130, 200, 230, 260, 400],
      tension: "0.4",
      borderColor: "#4E7DD9",
      fill: true,
      pointBorderColor: "transparent",
      pointBackgroundColor: "transparent",
      pointHoverBackgroundColor: "#EEEEEE",
      pointHoverBorderColor: "#4E7DD9",
      pointRadius: "8",
      pointHoverRadius: "8",
      pointHoverBorderWidth: "5",
    },
  ],
};

const options = {
  hover: {
    intersect: false,
    mode: "index",
  },
  elements: {
    point: {
      // radius: 20,
      // borderWidth: "8",
    },
    line: {
      borderWidth: "5",
    },
  },
  plugins: {
    // ChartsJS DataLabels initialized here
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        footer: footer,
      },
      backgroundColor: "red",
      borderColor: "#01052D",
      borderWidth: "1",
      caretSize: "0",
      // position: "myCustomPositioner",
      padding: {
        x: 20,
        y: 25,
      },
      displayColors: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: "#01052D",
        font: {
          size: "11",
        },
        callback: function (value, index) {
          const val = this.getLabelForValue(value);
          if (val == 0) {
            return "";
          } else {
            return val + "M";
          }
        },
      },
      grid: {
        display: false,
      },
    },
    x: {
      ticks: {
        color: "#01052D",
        font: {
          size: "11",
        },
      },
      grid: {
        display: false, // should make it true in future
        drawBorder: false,
        color: "#4E7DD9",
        z: "2",
        lineWidth: "7",
        drawTicks: false,
        // offset: true,
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
    <Container>
      <Chart ref={chartRef} type="line" options={options} data={chartData} />
    </Container>
  );
}
