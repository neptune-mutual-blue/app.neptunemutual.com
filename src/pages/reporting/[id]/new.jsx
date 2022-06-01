import { useRouter } from "next/router";
import { ComingSoon } from "@/common/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";
import { CoverStatsProvider } from "@/common/Cover/CoverStatsContext";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { NewIncidentReportPage } from "@/modules/reporting/new";

export function getServerSideProps() {
  return {
    props: {
      disabled: !isFeatureEnabled("reporting"),
    },
  };
}

export default function ReportingNewCoverPage({ disabled }) {
  const router = useRouter();
  const { id: cover_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);

  if (disabled) {
    return <ComingSoon />;
  }

  return (
    <CoverStatsProvider coverKey={coverKey}>
      <NewIncidentReportPage />
    </CoverStatsProvider>
  );
}
