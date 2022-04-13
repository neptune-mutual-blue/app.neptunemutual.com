import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { CoverReportingRules } from "@/src/modules/reporting/CoverReportingRules";
import { NewIncidentReportForm } from "@/src/modules/reporting/NewIncidentReportForm";
import { ReportingHero } from "@/src/modules/reporting/ReportingHero";
import { toBytes32 } from "@/src/helpers/cover";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFetchCoverActiveReportings } from "@/src/hooks/useFetchCoverActiveReportings";
import { ComingSoon } from "@/components/pages/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";

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
  const coverKey = toBytes32(cover_id);
  const { coverInfo } = useCoverInfo(coverKey);
  const { data: activeReportings } = useFetchCoverActiveReportings({
    coverKey,
  });

  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [accepted]);

  // Redirect to active reporting if exists
  useEffect(() => {
    const hasActiveReportings = activeReportings && activeReportings.length > 0;
    if (hasActiveReportings) {
      router.replace(
        `/reporting/${cover_id}/${activeReportings[0].incidentDate}/details`
      );
    }
  }, [activeReportings, cover_id, router]);

  if (!coverInfo) {
    return <>loading...</>;
  }

  const handleAcceptRules = () => {
    setAccepted(true);
  };

  if (disabled) {
    return <ComingSoon />;
  }

  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>

      {/* hero */}
      <ReportingHero coverInfo={coverInfo} />

      {accepted ? (
        <NewIncidentReportForm coverKey={coverKey} />
      ) : (
        <CoverReportingRules
          coverInfo={coverInfo}
          handleAcceptRules={handleAcceptRules}
          activeReportings={activeReportings}
        />
      )}
    </main>
  );
}
