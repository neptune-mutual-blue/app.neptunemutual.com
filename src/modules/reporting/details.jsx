import { ReportingHero } from "@/src/modules/reporting/ReportingHero";
import { RecentVotesTable } from "@/src/modules/reporting/RecentVotesTable";
import { Container } from "@/common/Container/Container";
import { ResolvedReportSummary } from "@/src/modules/reporting/resolved/ResolvedReportSummary";
import DateLib from "@/lib/date/DateLib";
import { isGreater } from "@/utils/bn";
import { ActiveReportSummary } from "@/src/modules/reporting/active/ActiveReportSummary";
import { CastYourVote } from "@/src/modules/reporting/active/CastYourVote";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";
import { useConsensusReportingInfo } from "@/src/hooks/useConsensusReportingInfo";
import { useRetryUntilPassed } from "@/src/hooks/useRetryUntilPassed";

export const ReportingDetailsPage = ({ incidentReport, refetchReport }) => {
  const coverInfo = useCoverOrProductData({
    coverKey: incidentReport.coverKey,
    productKey: incidentReport.productKey,
  });

  const { info, refetch: refetchInfo } = useConsensusReportingInfo({
    coverKey: incidentReport.coverKey,
    productKey: incidentReport.productKey,
    incidentDate: incidentReport.incidentDate,
  });

  const isPassedResolutionDeadline = useRetryUntilPassed(() => {
    const _now = DateLib.unix();

    if (
      incidentReport?.resolutionDeadline === "0" ||
      !Number(incidentReport?.resolutionDeadline)
    ) {
      return false;
    } else {
      return isGreater(_now, incidentReport.resolutionDeadline);
    }
  }, true);

  if (!coverInfo) {
    return null;
  }

  const now = DateLib.unix();
  const showResolvedSummary =
    incidentReport.resolved && isPassedResolutionDeadline;
  const reportingEnded = isGreater(now, incidentReport.resolutionTimestamp);

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
            refetchInfo={refetchInfo}
            refetchReport={refetchReport}
            incidentReport={incidentReport}
            yes={info.yes}
            no={info.no}
            willReceive={info.willReceive}
          />
        ) : (
          <ActiveReportSummary
            refetchInfo={refetchInfo}
            refetchReport={refetchReport}
            incidentReport={incidentReport}
            resolvableTill={incidentReport.resolutionDeadline}
            yes={info.yes}
            no={info.no}
          />
        )}

        {
          // to be displayed in mobile only
          !reportingEnded && (
            <div className="block my-16 md:hidden">
              <CastYourVote incidentReport={incidentReport} />
            </div>
          )
        }

        <RecentVotesTable
          coverKey={incidentReport.coverKey}
          productKey={incidentReport.productKey}
          incidentDate={incidentReport.incidentDate}
        />
      </Container>
    </>
  );
};
