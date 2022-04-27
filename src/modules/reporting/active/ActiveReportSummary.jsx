import { Divider } from "@/common/Divider/Divider";
import { OutlinedCard } from "@/common/OutlinedCard/OutlinedCard";
import { CastYourVote } from "@/src/modules/reporting/active/CastYourVote";
import { IncidentReporter } from "@/src/modules/reporting/IncidentReporter";
import { InsightsTable } from "@/src/modules/reporting/InsightsTable";
import { ResolveIncident } from "@/src/modules/reporting/resolved/ResolveIncident";
import { VotesSummaryDoughnutChart } from "@/src/modules/reporting/VotesSummaryDoughnutCharts";
import { HlCalendar } from "@/lib/hl-calendar";
import { truncateAddress } from "@/utils/address";
import { convertFromUnits, isGreater } from "@/utils/bn";
import BigNumber from "bignumber.js";
import DateLib from "@/lib/date/DateLib";
import { formatPercent } from "@/utils/formatter/percent";
import { VotesSummaryHorizontalChart } from "@/src/modules/reporting/VotesSummaryHorizontalChart";
import { useRetryUntilPassed } from "@/src/hooks/useRetryUntilPassed";
import { t, Trans } from "@lingui/macro";
import { useNumberFormat } from "@/src/hooks/useNumberFormat";

export const ActiveReportSummary = ({
  refetchReport,
  incidentReport,
  resolvableTill,
}) => {
  const startDate = DateLib.fromUnix(incidentReport.incidentDate);
  const endDate = DateLib.fromUnix(incidentReport.resolutionTimestamp);

  const { formatCurrency } = useNumberFormat();

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

  // Refreshes when reporting period ends
  useRetryUntilPassed(() => {
    const _now = DateLib.unix();
    return isGreater(_now, incidentReport.resolutionTimestamp);
  }, true);

  return (
    <>
      <OutlinedCard className="bg-white md:flex">
        {/* Left half */}
        <div className="flex-1 p-6 pb-0 sm:pb-6 lg:p-10 md:border-r border-B0C4DB">
          <h2 className="mb-6 font-bold text-h3 font-sora">
            <Trans>Report Summary</Trans>
          </h2>

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

          <>
            {reportingEnded ? (
              <ResolveIncident
                incidentReport={incidentReport}
                resolvableTill={resolvableTill}
                refetchReport={refetchReport}
              />
            ) : (
              <CastYourVote incidentReport={incidentReport} />
            )}
          </>
        </div>

        {/* Right half */}
        <div className="p-6 pt-0 lg:p-10 sn:pt-6">
          <h3 className="mb-4 font-bold text-h4 font-sora">Insights</h3>
          <InsightsTable
            insights={[
              {
                title: t`Incident Occurred`,
                value: formatPercent(yesPercent),
                variant: "success",
              },
              {
                title: t`User Votes:`,
                value: incidentReport.totalAttestedCount,
              },
              {
                title: t`Stake:`,
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
                title: t`False Reporting`,
                value: formatPercent(noPercent),
                variant: "error",
              },
              {
                title: t`User Votes:`,
                value: incidentReport.totalRefutedCount,
              },
              {
                title: t`Stake:`,
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
          <h3 className="mb-4 font-bold text-h4 font-sora">
            <Trans>Incident Reporters</Trans>
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
          <h3 className="mb-4 font-bold text-h4 font-sora">
            <Trans>Reporting Period</Trans>
          </h3>
          <p className="mb-4 text-sm opacity-50">
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
