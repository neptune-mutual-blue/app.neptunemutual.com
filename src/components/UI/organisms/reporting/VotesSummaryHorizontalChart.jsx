import { PercentXStackedChart } from "@/components/UI/molecules/PercentXStackedChart";
import { HorizontalChartLegend } from "@/components/UI/molecules/reporting/HorizontalChartLegend";
import { classNames } from "@/utils/classnames";
import { formatPercent } from "@/utils/formatter/percent";
import * as Tooltip from "@radix-ui/react-tooltip";

export const VotesSummaryHorizontalChart = ({
  yesPercent,
  noPercent,
  showTooltip,
  majority,
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
      <Tooltip.Root delayDuration={100} open={showTooltip}>
        <Tooltip.Trigger className="w-full">
          <PercentXStackedChart data={data} />
        </Tooltip.Trigger>

        <ToolTipContent majority={majority} />
      </Tooltip.Root>
      <HorizontalChartLegend />
    </>
  );
};

const ToolTipContent = ({ majority }) => {
  if (!majority) {
    return null;
  }

  return (
    <>
      <Tooltip.Content
        side="top"
        sideOffset={-32}
        className="test"
        portalled={false}
      >
        <div className="bg-white flex flex-col shadow-toolTip px-6 py-2 justify-center items-center rounded">
          <>
            <span
              className={classNames(
                "text-sm font-semibold leading-5",
                majority.variant == "success" ? "text-0FB88F" : "text-FA5C2F"
              )}
            >
              {majority.variant == "success"
                ? "Incident Occurred"
                : "False Reporting"}
            </span>
            <span className="text-black text-sm py-1 leading-5">
              {majority.voteCount} ({formatPercent(majority.percent)})
            </span>
          </>

          <span className="text-black text-sm opacity-40 leading-5">
            Stake: {majority.stake} NPM
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
