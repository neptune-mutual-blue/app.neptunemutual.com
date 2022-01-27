import { ReportingHero } from "@/components/UI/organisms/reporting/new/ReportingHero";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { RecentVotesTable } from "@/components/UI/organisms/reporting/RecentVotesTable";
import { ActiveReportSummary } from "@/components/UI/organisms/reporting/ActiveReportSummary";
import { Container } from "@/components/UI/atoms/container";
import { ResolvedReportSummary } from "@/components/UI/organisms/reporting/ResolvedReportSummary";

export const ReportingDetailsPage = ({ incidentReport }) => {
  const { coverInfo } = useCoverInfo(incidentReport.key);

  return (
    <>
      <ReportingHero coverInfo={coverInfo} />
      <hr className="border-b border-B0C4DB" />
      <Container className="py-16">
        {incidentReport.resolved ? (
          <ResolvedReportSummary />
        ) : (
          <ActiveReportSummary />
        )}

        <RecentVotesTable />
      </Container>
    </>
  );
};
