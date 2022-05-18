import { ReportingHero } from "@/src/modules/reporting/ReportingHero";
import { RecentVotesTable } from "@/src/modules/reporting/RecentVotesTable";
import { Container } from "@/common/Container/Container";
import { ResolvedReportSummary } from "@/src/modules/reporting/resolved/ResolvedReportSummary";
import DateLib from "@/lib/date/DateLib";
import { isGreater } from "@/utils/bn";
import { ActiveReportSummary } from "@/src/modules/reporting/active/ActiveReportSummary";
import { useRetryUntilPassed } from "@/src/hooks/useRetryUntilPassed";
import { useCovers } from "@/src/context/Covers";

export const ReportingDetailsPage = ({ incidentReport, refetchReport }) => {
  const { getInfoByKey } = useCovers();
  const coverInfo = getInfoByKey(incidentReport.key);

  const now = DateLib.unix();

  // Refreshes when resolution deadline passed (when reporting becomes unresolvable)
  useRetryUntilPassed(() => {
    const _now = DateLib.unix();
    return isGreater(_now, incidentReport.resolutionDeadline);
  }, true);

  if (!coverInfo) {
    return null;
  }

  const showResolvedSummary =
    incidentReport.resolved &&
    isGreater(now, incidentReport.resolutionDeadline);

  return (
    <>
      <ReportingHero
        coverInfo={coverInfo}
        reportStatus={{ resolved: incidentReport.resolved }}
      />
      <hr className="border-b border-B0C4DB" />
      <Container className="py-16">
        {showResolvedSummary ? (
          <ResolvedReportSummary
            refetchReport={refetchReport}
            incidentReport={incidentReport}
          />
        ) : (
          <ActiveReportSummary
            refetchReport={refetchReport}
            incidentReport={incidentReport}
            resolvableTill={incidentReport.resolutionDeadline}
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
