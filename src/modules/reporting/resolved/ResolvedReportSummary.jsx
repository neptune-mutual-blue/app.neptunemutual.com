import { OutlinedCard } from "@/common/OutlinedCard/OutlinedCard";
import { IncidentReporter } from "@/src/modules/reporting/IncidentReporter";
import { InsightsTable } from "@/src/modules/reporting/InsightsTable";
import { UnstakeYourAmount } from "@/src/modules/reporting/resolved/UnstakeYourAmount";
import { Divider } from "@/common/Divider/Divider";
import { convertFromUnits, isGreater } from "@/utils/bn";
import BigNumber from "bignumber.js";
import { truncateAddress } from "@/utils/address";
import { useFinalizeIncident } from "@/src/hooks/useFinalizeIncident";
import DateLib from "@/lib/date/DateLib";
import { VotesSummaryHorizontalChart } from "@/src/modules/reporting/VotesSummaryHorizontalChart";
import { formatPercent } from "@/utils/formatter/percent";
import { t, Trans } from "@lingui/macro";
import { useNumberFormat } from "@/src/hooks/useNumberFormat";

export const ResolvedReportSummary = ({ incidentReport, refetchReport }) => {
  const { finalize, finalizing } = useFinalizeIncident({
    coverKey: incidentReport.key,
    incidentDate: incidentReport.incidentDate,
  });
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

  return (
    <>
      <OutlinedCard className="bg-white md:flex">
        {/* Left half */}
        <div className="flex-1 p-10 md:border-r border-B0C4DB">
          <h2 className="mb-6 font-bold text-h3 font-sora">
            <Trans>Report Summary</Trans>
          </h2>

          <VotesSummaryHorizontalChart
            yesPercent={yesPercent}
            noPercent={noPercent}
            showTooltip={incidentReport.resolved}
            majority={majority}
          />
          <Divider />

          <UnstakeYourAmount incidentReport={incidentReport} />
        </div>

        {/* Right half */}
        <div className="p-10">
          <h3 className="mb-4 font-bold text-h4 font-sora">
            <Trans>Insights</Trans>
          </h3>
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
                  true
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
                value: formatCurrency(
                  convertFromUnits(incidentReport.totalRefutedStake),
                  "NPM",
                  true
                ).short,
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

          {!incidentReport.finalized && (
            <button
              className="text-sm text-4e7dd9"
              disabled={finalizing}
              onClick={async () => {
                await finalize();
                setTimeout(refetchReport, 15000);
              }}
            >
              {finalizing ? t`Finalizing...` : t`Finalize`}
            </button>
          )}
        </div>

        <></>
      </OutlinedCard>
    </>
  );
};
