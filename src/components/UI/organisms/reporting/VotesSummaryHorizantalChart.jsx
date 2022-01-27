import { PercentXStackedChart } from "@/components/UI/molecules/PercentXStackedChart";
import { HorizantalChartLegend } from "@/components/UI/molecules/reporting/HorizantalChartLegend";
import * as Tooltip from "@radix-ui/react-tooltip";

export const VotesSummaryHorizantalChart = ({
  yesPercent,
  noPercent,
  resolved,
}) => {
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
      <Tooltip.Root delayDuration={100} open={resolved}>
        <Tooltip.Trigger className="w-full">
          <PercentXStackedChart data={data} />
        </Tooltip.Trigger>

        <ToolTipContent yesPercent={yesPercent} />
      </Tooltip.Root>
      <HorizantalChartLegend />
    </>
  );
};

const ToolTipContent = ({ yesPercent }) => {
  return (
    <>
      <Tooltip.Content side="top" sideOffset={-32}>
        <div className="bg-white flex flex-col shadow-toolTip px-6 py-2 justify-center items-center rounded">
          <>
            <span className="text-0FB88F text-sm font-semibold leading-5">
              Incident Occured
            </span>
            <span className="text-black text-sm py-1 leading-5">
              123456({yesPercent}%)
            </span>
          </>

          <span className="text-black text-sm opacity-40 leading-5">
            Stake: 3M NPM
          </span>
        </div>
        <Tooltip.Arrow
          width={20}
          height={20}
          className="fill-white relative -top-2.5"
        />
      </Tooltip.Content>
    </>
  );
};
