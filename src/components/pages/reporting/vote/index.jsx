import Link from "next/link";

import { ReportingHero } from "@/components/UI/organisms/reporting/new/ReportingHero";
import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { ReportSummary } from "@/components/UI/organisms/reporting/ReportSummary";
import { RecentVotesTable } from "@/components/UI/organisms/reporting/RecentVotesTable";

export const VotePage = () => {
  const { coverInfo } = useCoverInfo();

  if (!coverInfo) {
    return <>loading...</>;
  }

  const imgSrc = "/covers/clearpool.png";
  const title = coverInfo.coverName;

  return (
    <>
      <ReportingHero {...{ coverInfo, imgSrc, title }} />
      <hr className="border-b border-B0C4DB" />
      <div className="px-28 pb-48">
        <div className="py-14">
          <ReportSummary />
        </div>
        <RecentVotesTable />
      </div>
    </>
  );
};
