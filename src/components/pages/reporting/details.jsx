import { ReportingHero } from "@/components/UI/organisms/reporting/new/ReportingHero";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { RecentVotesTable } from "@/components/UI/organisms/reporting/RecentVotesTable";
import { ActiveReportSummary } from "@/components/UI/organisms/reporting/ActiveReportSummary";
import { Container } from "@/components/UI/atoms/container";
import { ResolvedReportSummary } from "@/components/UI/organisms/reporting/ResolvedReportSummary";
import DateLib from "@/lib/date/DateLib";
import { isGreater, sumOf } from "@/utils/bn";

export const ReportingDetailsPage = ({ incidentReport }) => {
  const { coverInfo } = useCoverInfo(incidentReport.key);

  const now = DateLib.unix();

  let resolvableTill = incidentReport.claimBeginsFrom;

  if (incidentReport.claimBeginsFrom === "0") {
    const lastResolvedOn = incidentReport.emergencyResolved
      ? incidentReport.emergencyResolveTransaction?.timestamp
      : incidentReport.resolveTransaction?.timestamp;

    resolvableTill = sumOf(lastResolvedOn, 24 * 60 * 60).toString();
  }

  const showResolvedSummary =
    incidentReport.resolved && isGreater(now, resolvableTill);

  return (
    <>
      <ReportingHero coverInfo={coverInfo} />
      <hr className="border-b border-B0C4DB" />
      <Container className="py-16">
        {showResolvedSummary ? (
          <ResolvedReportSummary incidentReport={incidentReport} />
        ) : (
          <ActiveReportSummary
            incidentReport={incidentReport}
            resolvableTill={resolvableTill}
          />
        )}

        <RecentVotesTable
          coverKey={incidentReport.key}
          incidentDate={incidentReport.incidentDate}
        />
      </Container>
    </>
  );
};
