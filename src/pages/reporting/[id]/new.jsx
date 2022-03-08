import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { CoverReportingRules } from "@/components/reporting/CoverReportingRules";
import { NewIncidentReportForm } from "@/components/reporting/NewIncidentReportForm";
import { ReportingHero } from "@/components/UI/organisms/reporting/new/ReportingHero";
import { toBytes32 } from "@/src/helpers/cover";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFetchCoverActiveReportings } from "@/src/hooks/useFetchCoverActiveReportings";
import PageNotFound from "@/src/pages/404";
import { getFeatures } from "@/src/config/environment";

// This gets called on every request
export async function getServerSideProps() {
  // Pass data to the page via props
  const features = getFeatures();
  const enabled = features.indexOf("reporting") > -1;

  return {
    props: {
      disabled: !enabled,
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

  if (!coverInfo) {
    return <>loading...</>;
  }

  const handleAcceptRules = () => {
    setAccepted(true);
  };

  if (disabled) {
    return <PageNotFound />;
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
