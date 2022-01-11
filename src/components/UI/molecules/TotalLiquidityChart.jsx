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
  defaults,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { Container } from "@/src/components/UI/atoms/container";

const chartAreaBorder = {
  id: "chartAreaBorder",
  beforeDraw(chart, args, options) {
    const {
      ctx,
      chartArea: { left, top, bottom, width, height },
    } = chart;
    ctx.save();
    ctx.strokeStyle = options.borderColor;
    ctx.lineWidth = options.borderWidth;
    ctx.strokeRect(left, top, options.borderWidth, height + 30);
    ctx.strokeRect(left - 30, bottom, width + 60, options.borderWidth);
    ctx.restore();
  },
};

ChartJS.register(
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  chartAreaBorder
);

defaults.font.family = "Sora, sans-serif";

const labels = [
  "Dec 3",
  "Dec 12",
  "Dec 21",
  "Dec 30",
  "Jan 8",
  "Jan 17",
  "Jan 26",
];

const getOrCreateTooltip = (chart) => {
  let tooltipEl = chart.canvas.parentNode.querySelector("div");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.style.background = "transparent";
    tooltipEl.style.border = "1px solid #01052D";
    tooltipEl.style.borderRadius = "6px";
    tooltipEl.style.color = "#01052D";
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.transform = "translate(-100%, -120%)";
    tooltipEl.style.transition = "all .1s ease";

    const table = document.createElement("table");
    table.style.margin = "0px";

    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

const externalTooltipHandler = (context) => {
  // Tooltip Element
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b) => b.lines);

    const tableBody = document.createElement("tbody");
    tableBody.style.textAlign = "left";

    titleLines.forEach((title) => {
      const tr = document.createElement("tr");
      tr.style.borderWidth = "0";

      const td = document.createElement("td");
      td.style.borderWidth = "0";
      td.style.color = "#5C738F";
      td.style.fontSize = "12px";
      td.style.paddingLeft = "16px";
      td.style.paddingRight = "16px";
      td.style.fontFamily = "Sora, sans-serif";

      const customText = title?.toUpperCase() + " 13:00 UTC";

      const text = document.createTextNode(customText);

      td.appendChild(text);
      tr.appendChild(td);
      tableBody.appendChild(tr);
    });

    const tableHead = document.createElement("thead");
    tableHead.style.textAlign = "left";

    bodyLines.forEach((body, i) => {
      const span = document.createElement("span");
      span.style.display = "inline-block";

      const tr = document.createElement("tr");
      tr.style.backgroundColor = "transparent";
      tr.style.borderWidth = "0";

      const th = document.createElement("th");
      th.style.borderWidth = "0";
      th.style.paddingLeft = "16px";
      th.style.paddingRight = "16px";
      th.style.fontFamily = "Sora, sans-serif";

      const customBody = "$ " + body + "M";

      const text = document.createTextNode(customBody);

      th.appendChild(span);
      th.appendChild(text);
      tr.appendChild(th);
      tableHead.appendChild(tr);
    });

    const tableRoot = tooltipEl.querySelector("table");

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    tableRoot.appendChild(tableBody);
    tableRoot.appendChild(tableHead);
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + "px";
  tooltipEl.style.top = positionY + tooltip.caretY + "px";
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding =
    tooltip.options.padding + "px " + tooltip.options.padding + "px";
};

export const data = {
  labels,
  datasets: [
    {
      data: [50.35, 104.78, 130.45, 203.98, 220.12, 260.45, 390.98],
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
  responsive: true,
  maintainAspectRatio: false,
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
    chartAreaBorder: {
      borderColor: "#01052D",
      borderWidth: 0.5,
    },
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
      position: "nearest",
      external: externalTooltipHandler,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: "#01052D",
        padding: 20,
        font: {
          size: "11",
          family: "Poppins, sans-serif",
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
        padding: 20,
        font: {
          size: "11",
          family: "Poppins, sans-serif",
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
    <Container className="flex w-full h-[22rem]">
      <div className="border-2 w-1/2"></div>
      <div className="w-1/2 border-2">
        <Chart ref={chartRef} type="line" options={options} data={chartData} />
      </div>
    </Container>
  );
}
