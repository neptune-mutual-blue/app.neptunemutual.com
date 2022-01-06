import {
  Chart as ChartJS,
  defaults,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { each } from "chart.js/helpers";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

const data = {
  labels: ["votes"],

  datasets: [
    {
      data: [75],
      barThickness: 32,
      backgroundColor: "#0FB88F",
      hoverBackgroundColor: "#0FB88F",
    },
    {
      data: [25],
      barThickness: 32,
      backgroundColor: "#FA5C2F",
      hoverBackgroundColor: "#FA5C2F",
    },
  ],
};

defaults.font.family = "Poppins, sans-serif";

export const PercentXStackedChart = () => {
  return (
    <>
      <div style={{ width: "100%" }}>
        <Bar
          data={data}
          height={100}
          options={{
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                stacked: true,
                grid: {
                  drawBorder: false,
                },
                ticks: {
                  stepSize: 20,
                  callback: (val) => `${val}%`,
                },
              },
              y: {
                display: false,
                stacked: true,
                beginAtZero: true,
                grid: { display: false },
              },
            },
            events: [
              /* "mousemove", "mouseout", "click", "touchstart", "touchmove", "touchend" */
            ],
            animation: {
              onComplete: function (self) {
                var chartInstance = self.chart;
                var ctx = chartInstance.ctx;
                ctx.textAlign = "left";
                ctx.font = "14px Poppins";
                ctx.fillStyle = "#fff";
                var prevX = 0;

                each(
                  self.chart.data.datasets.forEach(function (dataset, i) {
                    var meta = chartInstance.getDatasetMeta(i);

                    each(
                      meta.data.forEach(function (bar, index) {
                        data = dataset.data[index];
                        const start = prevX;
                        const end = bar.x;

                        ctx.fillText(`${data}%`, (start + end) / 2, bar.y + 4);

                        prevX = bar.x;
                      }),
                      self
                    );
                  }),
                  self
                );
              },
            },
            plugins: {
              legend: false,
              tooltip: false,
            },
          }}
        />
      </div>
    </>
  );
};
