import Link from "next/link";

import { ReportingHero } from "@/components/UI/organisms/reporting/new/ReportingHero";
import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { RecentVotesTable } from "@/components/UI/organisms/reporting/RecentVotesTable";
import { ActiveReportSummary } from "@/components/UI/organisms/reporting/ActiveReportSummary";

export const VotePage = () => {
  const { coverInfo } = useCoverInfo();

  if (!coverInfo) {
    return <>loading...</>;
  }

  const imgSrc = "/covers/clearpool.png";
  const title = coverInfo.name;

  return (
    <>
      <ReportingHero {...{ coverInfo, imgSrc, title }} />
      <hr className="border-b border-B0C4DB" />
      <div className="px-28 pb-48">
        <div className="py-14">
          <ActiveReportSummary />
        </div>
        <RecentVotesTable />
      </div>
    </>
  );
};
