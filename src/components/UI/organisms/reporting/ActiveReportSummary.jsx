import { Divider } from "@/components/UI/atoms/divider";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { CastYourVote } from "@/components/UI/molecules/reporting/CastYourVote";
import { IncidentReporter } from "@/components/UI/molecules/reporting/IncidentReporter";
import { InsightsTable } from "@/components/UI/molecules/reporting/InsightsTable";
import { ResolveIncident } from "@/components/UI/molecules/reporting/ResolveIncident";
import { VotesSummaryDoughnutChart } from "@/components/UI/organisms/reporting/VotesSummaryDoughnutCharts";
import { HlCalendar } from "@/lib/hl-calendar";
import { truncateAddress } from "@/utils/address";
import { convertFromUnits, isGreater } from "@/utils/bn";
import BigNumber from "bignumber.js";
import DateLib from "@/lib/date/DateLib";
import { formatCurrency } from "@/utils/formatter/currency";
import { formatPercent } from "@/utils/formatter/percent";
import { VotesSummaryHorizontalChart } from "@/components/UI/organisms/reporting/VotesSummaryHorizontalChart";

export const ActiveReportSummary = ({ incidentReport, resolvableTill }) => {
  const startDate = new Date(incidentReport.incidentDate * 1000);
  const endDate = new Date(incidentReport.resolutionTimestamp * 1000);

  const votes = {
    yes: convertFromUnits(incidentReport.totalAttestedStake)
      .decimalPlaces(0)
      .toNumber(),
    no: convertFromUnits(incidentReport.totalRefutedStake)
      .decimalPlaces(0)
      .toNumber(),
  };

  const yesPercent = BigNumber(votes.yes / (votes.yes + votes.no))
    .decimalPlaces(2)
    .toNumber();
  const noPercent = BigNumber(1 - yesPercent)
    .decimalPlaces(2)
    .toNumber();

  let isAttestedWon = incidentReport.decision;

  if (incidentReport.decision === null) {
    isAttestedWon = isGreater(
      incidentReport.totalAttestedStake,
      incidentReport.totalRefutedStake
    );
  }

  const majority = {
    voteCount: isAttestedWon
      ? incidentReport.totalAttestedCount
      : incidentReport.totalRefutedCount,
    stake: isAttestedWon ? votes.yes : votes.no,
    percent: isAttestedWon ? yesPercent : noPercent,
    variant: isAttestedWon ? "success" : "failure",
  };

  const now = DateLib.unix();
  const reportingEnded = isGreater(now, incidentReport.resolutionTimestamp);

  return (
    <>
      <OutlinedCard className="md:flex bg-white">
        {/* Left half */}
        <div className="pb-0 md:pb-6 p-6 md:p-10 md:border-r border-B0C4DB flex-1">
          <h2 className="text-h3 font-sora font-bold mb-6">Report Summary</h2>

          {!reportingEnded && (
            <>
              <VotesSummaryDoughnutChart
                votes={votes}
                yesPercent={yesPercent}
                noPercent={noPercent}
              />
              <Divider />
            </>
          )}

          <VotesSummaryHorizontalChart
            yesPercent={yesPercent}
            noPercent={noPercent}
            showTooltip={reportingEnded}
            majority={majority}
          />
          <Divider />

          <div className="p-6 md:p-0">
            {reportingEnded ? (
              <ResolveIncident
                incidentReport={incidentReport}
                resolvableTill={resolvableTill}
              />
            ) : (
              <CastYourVote incidentReport={incidentReport} />
            )}
          </div>
        </div>

        {/* Right half */}
        <div className="pt-0 p-6 md:p-10">
          <h3 className="text-h4 font-sora font-bold mb-4">Insights</h3>
          <InsightsTable
            insights={[
              {
                title: "Incident Occurred",
                value: formatPercent(yesPercent),
                variant: "success",
              },
              {
                title: "User Votes:",
                value: incidentReport.totalAttestedCount,
              },
              {
                title: "Stake:",
                value: formatCurrency(
                  convertFromUnits(incidentReport.totalAttestedStake),
                  "NPM",
                  truncateAddress
                ).short,
              },
            ]}
          />

          <hr className="mt-4 mb-6 border-t border-d4dfee" />
          <InsightsTable
            insights={[
              {
                title: "False Reporting",
                value: formatPercent(noPercent),
                variant: "error",
              },
              { title: "User Votes:", value: incidentReport.totalRefutedCount },
              {
                title: "Stake:",
                value: `${
                  formatCurrency(
                    convertFromUnits(incidentReport.totalRefutedStake),
                    "NPM",
                    true
                  ).short
                }`,
              },
            ]}
          />

          <hr className="mt-6 mb-6 border-t border-d4dfee" />
          <h3 className="text-h4 font-sora font-bold mb-4">
            Incident Reporters
          </h3>
          <IncidentReporter
            variant={"success"}
            account={truncateAddress(incidentReport.reporter)}
            txHash={incidentReport.reportTransaction.id}
          />
          {incidentReport.disputer && (
            <IncidentReporter
              variant={"error"}
              account={truncateAddress(incidentReport.disputer)}
              txHash={incidentReport.disputeTransaction.id}
            />
          )}

          <hr className="mt-8 mb-6 border-t border-d4dfee" />
          <h3 className="text-h4 font-sora font-bold mb-4">Reporting Period</h3>
          <p className="text-sm opacity-50 mb-4">
            <span title={DateLib.toLongDateFormat(incidentReport.incidentDate)}>
              {DateLib.toDateFormat(
                incidentReport.incidentDate,
                { month: "short", day: "numeric" },
                "UTC"
              )}
            </span>
            {" - "}
            <span
              title={DateLib.toLongDateFormat(
                incidentReport.resolutionTimestamp
              )}
            >
              {DateLib.toDateFormat(
                incidentReport.resolutionTimestamp,
                { month: "short", day: "numeric" },
                "UTC"
              )}
            </span>
          </p>
          {!reportingEnded && (
            <HlCalendar startDate={startDate} endDate={endDate} />
          )}
        </div>
      </OutlinedCard>
    </>
  );
};
