import { ReportingHero } from "@/components/UI/organisms/reporting/new/ReportingHero";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { RecentVotesTable } from "@/components/UI/organisms/reporting/RecentVotesTable";
import { useRouter } from "next/router";
import { ResolvedReportSummary } from "@/components/UI/organisms/reporting/ResolvedReportSummary";
import { toBytes32 } from "@/src/helpers/cover";

export const IncidentResolved = () => {
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
      <div className="px-28 pb-48">
        <div className="py-14">
          <ResolvedReportSummary />
        </div>
        <RecentVotesTable />
      </div>
    </>
  );
};
