import { PercentDoughnutChart } from "@/components/UI/molecules/PercentDoughnutChart";
import { classNames } from "@/utils/classnames";
import { formatPercent } from "@/utils/formatter/percent";

export const VotesSummaryDoughnutChart = ({ votes, yesPercent, noPercent }) => {
  const yesData = {
    // labels: ["Red", "Blue"],
    datasets: [
      {
        label: "# of Votes",
        data: [noPercent, yesPercent],
        backgroundColor: ["#DEEAF6", "#0FB88F"],
        borderColor: ["#DEEAF6", "#0FB88F"],
        borderWidth: 1,
      },
    ],
  };
  const noData = {
    // labels: ["Red", "Blue"],
    datasets: [
      {
        label: "# of Votes",
        data: [noPercent, yesPercent],
        backgroundColor: ["#FA5C2F", "#DEEAF6"],
        borderColor: ["#FA5C2F", "#DEEAF6"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div className="my-10 flex justify-center items-center flex-wrap gap-8">
        <div className="relative max-w-fit">
          <DoughnutChartInsight
            title="Incident Occurred"
            percent={formatPercent(yesPercent)}
            amountStaked={votes.yes}
            variant="success"
          />
          <PercentDoughnutChart data={yesData} />
        </div>

        <div className="relative max-w-fit">
          <DoughnutChartInsight
            title="False Reporting"
            percent={formatPercent(noPercent)}
            amountStaked={votes.no}
            variant="error"
          />
          <PercentDoughnutChart data={noData} />
        </div>
      </div>
    </>
  );
};

const DoughnutChartInsight = ({ title, percent, amountStaked, variant }) => {
  return (
    <div className="absolute flex flex-col justify-center items-center w-16 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <h5
        className={classNames(
          "text-h4 font-bold text-center",
          variant === "success" ? "text-0FB88F" : "text-FA5C2F"
        )}
      >
        {title}
      </h5>
      <p className="mt-1">({percent}%)</p>
      <p className="opacity-40 whitespace-nowrap overflow-ellipsis">
        {amountStaked} NPM
      </p>
    </div>
  );
};
