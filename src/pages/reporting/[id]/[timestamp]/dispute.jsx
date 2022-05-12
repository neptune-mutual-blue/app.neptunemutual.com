import Head from "next/head";
import { useRouter } from "next/router";
import { useFetchReport } from "@/src/hooks/useFetchReport";
import { NewDisputeReportForm } from "@/src/modules/reporting/NewDisputeReportForm";
import { ReportingHero } from "@/src/modules/reporting/ReportingHero";
import { Container } from "@/common/Container/Container";
import { Alert } from "@/common/Alert/Alert";
import DateLib from "@/lib/date/DateLib";
import { isGreater } from "@/utils/bn";
import { ComingSoon } from "@/common/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";
import { Trans } from "@lingui/macro";
import { CoverStatsProvider } from "@/common/Cover/CoverStatsContext";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { useCovers } from "@/src/context/Covers";

export function getServerSideProps() {
  return {
    props: {
      disabled: !isFeatureEnabled("reporting"),
    },
  };
}

export default function DisputeFormPage({ disabled }) {
  const router = useRouter();
  const { id: cover_id, timestamp } = router.query;

  const coverKey = safeFormatBytes32String(cover_id);
  const { getInfoByKey } = useCovers();
  const coverInfo = getInfoByKey(coverKey);
  const { data, loading } = useFetchReport({
    coverKey: coverKey,
    incidentDate: timestamp,
  });

  const now = DateLib.unix();
  const reportingEnded = data?.incidentReport
    ? isGreater(now, data.incidentReport.resolutionTimestamp)
    : false;

  const canDispute =
    !reportingEnded && data?.incidentReport?.totalRefutedCount === "0";

  if (disabled) {
    return <ComingSoon />;
  }

  return (
    <CoverStatsProvider coverKey={coverKey}>
      <main>
        <Head>
          <title>Neptune Mutual Covers</title>
          <meta
            name="description"
            content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
          />
        </Head>

        {/* hero */}
        <ReportingHero
          coverInfo={coverInfo}
          reportStatus={{
            resolved: data.incidentReport?.resolved,
            dispute: true,
          }}
        />

        <hr className="border-t border-t-B0C4DB" />

        {loading && (
          <p className="text-center">
            <Trans>Loading...</Trans>
          </p>
        )}

        {!loading && !data.incidentReport && (
          <p className="text-center">
            <Trans>No data found</Trans>
          </p>
        )}

        {data.incidentReport && (
          <div>
            <Container className="py-16">
              {canDispute ? (
                <NewDisputeReportForm incidentReport={data.incidentReport} />
              ) : (
                <Alert>
                  <Trans>Not applicable for disputing</Trans>
                </Alert>
              )}
            </Container>
          </div>
        )}
      </main>
    </CoverStatsProvider>
  );
}
