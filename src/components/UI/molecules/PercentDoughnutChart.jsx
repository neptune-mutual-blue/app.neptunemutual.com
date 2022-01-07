import { Chart as ChartJS, ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement);

export const PercentDoughnutChart = ({ data }) => {
  return (
    <>
      <div style={{ width: "240px", height: "240px" }}>
        <Doughnut
          data={data}
          options={{
            cutout: 90,
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
