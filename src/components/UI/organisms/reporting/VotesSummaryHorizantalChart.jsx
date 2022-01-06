import { PercentXStackedChart } from "@/components/UI/molecules/PercentXStackedChart";
import { HorizantalChartLegend } from "@/components/UI/molecules/reporting/HorizantalChartLegend";

export const VotesSummaryHorizantalChart = ({ votes }) => {
  const yesPercent = (votes.yes * 100) / (votes.yes + votes.no);
  const noPercent = 100 - yesPercent;

  const data = {
    labels: ["votes"],

    datasets: [
      {
        data: [yesPercent],
        barThickness: 32,
        backgroundColor: "#0FB88F",
        hoverBackgroundColor: "#0FB88F",
      },
      {
        data: [noPercent],
        barThickness: 32,
        backgroundColor: "#FA5C2F",
        hoverBackgroundColor: "#FA5C2F",
      },
    ],
  };

  return (
    <>
      <PercentXStackedChart data={data} />
      <HorizantalChartLegend />
    </>
  );
};
