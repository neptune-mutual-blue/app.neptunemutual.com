import { PercentXStackedChart } from "@/common/PercentXStackedChart";
import { HorizontalChartLegend } from "@/src/modules/reporting/HorizontalChartLegend";
import { classNames } from "@/utils/classnames";
import * as Tooltip from "@radix-ui/react-tooltip";
import { t, Trans } from "@lingui/macro";
import { useNumberFormat } from "@/src/hooks/useNumberFormat";

export const VotesSummaryHorizontalChart = ({
  yesPercent,
  noPercent,
  showTooltip,
  majority,
}) => {
  const data = {
    labels: [t`votes`],
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
  const { formatPercent } = useNumberFormat();

  if (!majority) {
    return null;
  }

  return (
    <>
      <Tooltip.Content
        side="top"
        sideOffset={-32}
        className="hidden test md:block"
        portalled={false}
      >
        <div className="flex flex-col items-center justify-center px-6 py-2 bg-white rounded shadow-toolTip">
          <>
            <span
              className={classNames(
                "text-sm font-semibold leading-5",
                majority.variant == "success" ? "text-0FB88F" : "text-FA5C2F"
              )}
            >
              {majority.variant == "success"
                ? t`Incident Occurred`
                : t`False Reporting`}
            </span>
            <span className="py-1 text-sm leading-5 text-black">
              {majority.voteCount} ({formatPercent(majority.percent)})
            </span>
          </>

          <span className="text-sm leading-5 text-black opacity-40">
            <Trans>Stake:</Trans> {majority.stake} NPM
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
