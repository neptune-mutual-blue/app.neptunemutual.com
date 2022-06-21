import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Trans } from "@lingui/macro";
import { CoverReportingRules } from "@/src/modules/reporting/CoverReportingRules";
import { NewIncidentReportForm } from "@/src/modules/reporting/NewIncidentReportForm";
import { ReportingHero } from "@/src/modules/reporting/ReportingHero";
import { useFetchCoverActiveReportings } from "@/src/hooks/useFetchCoverActiveReportings";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { useFetchProductInfo } from "@/src/hooks/useFetchProductInfo";

export function NewIncidentReportPage() {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();
  const { product_id, cover_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);
  const productKey = safeFormatBytes32String(product_id || "");
  const coverInfo = useFetchProductInfo(coverKey, productKey);
  const { data: activeReportings } = useFetchCoverActiveReportings({
    coverKey,
  });

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
    return <Trans>loading...</Trans>;
  }

  const handleAcceptRules = () => {
    setAccepted(true);
  };

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
