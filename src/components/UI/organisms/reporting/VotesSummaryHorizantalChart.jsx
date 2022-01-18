import { PercentXStackedChart } from "@/components/UI/molecules/PercentXStackedChart";
import { HorizantalChartLegend } from "@/components/UI/molecules/reporting/HorizantalChartLegend";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useState, useEffect, useRef, useCallback } from "react";

export const VotesSummaryHorizantalChart = ({ votes }) => {
  const [resolved, setResolved] = useState(false);
  const chartElement = useRef(null);

  const yesPercent = (votes.yes * 100) / (votes.yes + votes.no);
  const noPercent = 100 - yesPercent;

  const mouseOverHandler = useCallback(
    (e) => {
      const boundingRect = e.target.getBoundingClientRect();
      const xPos = e.clientX - boundingRect.left;
      const totalYesWidth = (yesPercent * 740) / 100 - 50;

      if (xPos <= totalYesWidth) {
        setResolved(true);
        return;
      }
      setResolved(false);
    },
    [yesPercent]
  );

  useEffect(() => {
    chartElement.current = document.getElementById("incident-resolved-chart");

    chartElement.current &&
      chartElement.current.addEventListener("mousemove", mouseOverHandler);

    return () => {
      chartElement.current &&
        chartElement.current.removeEventListener("mousemove", mouseOverHandler);
    };
  }, [mouseOverHandler]);

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
      <Tooltip.Root delayDuration={100}>
        <Tooltip.Trigger className="w-full">
          <PercentXStackedChart data={data} />
        </Tooltip.Trigger>

        <ToolTipContent {...{ yesPercent, noPercent, resolved }} />
      </Tooltip.Root>
      <HorizantalChartLegend />
    </>
  );
};

const ToolTipContent = ({ yesPercent, noPercent, resolved }) => {
  return (
    <>
      <Tooltip.Content side="top" className="relative top-8">
        <div className="bg-white flex flex-col shadow-toolTip px-6 py-2 justify-center items-center rounded">
          {resolved ? (
            <>
              <span className="text-0FB88F text-sm font-semibold leading-5">
                Incident Occured
              </span>
              <span className="text-black text-sm py-1 leading-5">
                123456({yesPercent}%)
              </span>
            </>
          ) : (
            <>
              <span className="text-FA5C2F text-sm font-semibold leading-5">
                Failed
              </span>
              <span className="text-black text-sm py-1 leading-5">
                456({noPercent}%)
              </span>
            </>
          )}

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
