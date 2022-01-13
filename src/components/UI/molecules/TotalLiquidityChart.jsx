import React, { useRef, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  defaults,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getLiquidityChartData } from "@/src/_mocks/my-liquidity/chartData";
import { monthNames } from "@/lib/dates";

const month = monthNames.map((x) => x.substring(0, 3));

let labels = [];

const liquidityChartData = getLiquidityChartData();

liquidityChartData.map((d) => {
  const newDate = new Date(d.date);
  const mon = month[newDate.getMonth()];
  const date = newDate.getDate();
  labels.push(mon.toUpperCase() + " " + date);
});

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
  chartAreaBorder
);

defaults.font.family = "Sora, sans-serif";

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
      td.style.paddingRight = "24px";
      td.style.fontFamily = "Sora, sans-serif";
      td.style.lineHeight = "0px";
      td.style.whiteSpace = "nowrap";
      td.style.fontWeight = "400";
      td.style.paddingTop = "8px";
      td.style.paddingBottom = "12px";

      const customText = title?.toUpperCase() + " 13:00 UTC";

      const text = document.createTextNode(customText);

      td.appendChild(text);
      tr.appendChild(td);
      tableBody.appendChild(tr);
    });

    const tableHead = document.createElement("thead");
    tableHead.style.textAlign = "left";

    bodyLines.forEach((body) => {
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
      th.style.whiteSpace = "nowrap";
      th.style.fontWeight = "400";

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
      data: liquidityChartData?.map((d) => d.amount),
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
        callback: function (value) {
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
        labelOffset: 30,
        callback(value, index) {
          const val = this.getLabelForValue(value);
          if (index > 5) return "";
          return val;
        },
      },
      grid: {
        display: false,
        drawBorder: false,
        color: "#4E7DD9",
        z: "2",
        lineWidth: "7",
        drawTicks: false,
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

  if (!liquidityChartData) {
    return <>Loading...</>;
  }

  return <Line ref={chartRef} options={options} data={chartData} />;
}
