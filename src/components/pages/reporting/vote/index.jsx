import { ReportingHero } from "@/components/UI/organisms/reporting/new/ReportingHero";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { RecentVotesTable } from "@/components/UI/organisms/reporting/RecentVotesTable";
import { ActiveReportSummary } from "@/components/UI/organisms/reporting/ActiveReportSummary";
import { useRouter } from "next/router";
import { Container } from "@/components/UI/atoms/container";
import { toBytes32 } from "@/src/helpers/cover";

export const VotePage = () => {
  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = toBytes32(cover_id);
  const { coverInfo } = useCoverInfo(coverKey);

  if (!coverInfo) {
    return <>loading...</>;
  }

  return (
    <>
      <ReportingHero coverInfo={coverInfo} />
      <hr className="border-b border-B0C4DB" />
      <Container className="py-16">
        <ActiveReportSummary />

        <RecentVotesTable />
      </Container>
    </>
  );
};
