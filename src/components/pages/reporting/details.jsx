import { ReportingHero } from "@/components/UI/organisms/reporting/new/ReportingHero";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { RecentVotesTable } from "@/components/UI/organisms/reporting/RecentVotesTable";
import { ActiveReportSummary } from "@/components/UI/organisms/reporting/ActiveReportSummary";
import { Container } from "@/components/UI/atoms/container";
import { ResolvedReportSummary } from "@/components/UI/organisms/reporting/ResolvedReportSummary";
import DateLib from "@/lib/date/DateLib";
import { isGreater } from "@/utils/bn";

export const ReportingDetailsPage = ({ incidentReport }) => {
  const { coverInfo } = useCoverInfo(incidentReport.key);

  const now = DateLib.unix();
  const showResolvedSummary =
    incidentReport.resolved && isGreater(now, incidentReport.claimBeginsFrom);

  return (
    <>
      <ReportingHero coverInfo={coverInfo} />
      <hr className="border-b border-B0C4DB" />
      <Container className="py-16">
        {showResolvedSummary ? (
          <ResolvedReportSummary incidentReport={incidentReport} />
        ) : (
          <ActiveReportSummary incidentReport={incidentReport} />
        )}

        <RecentVotesTable
          coverKey={incidentReport.key}
          incidentDate={incidentReport.incidentDate}
        />
      </Container>
    </>
  );
};
