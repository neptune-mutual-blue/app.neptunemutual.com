import Head from "next/head";
import { useRouter } from "next/router";
import { useFetchReport } from "@/src/hooks/useFetchReport";
import { toBytes32 } from "@/src/helpers/cover";
import { NewDisputeReportForm } from "@/components/reporting/NewDisputeReportForm";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { ReportingHero } from "@/components/UI/organisms/reporting/new/ReportingHero";
import { Container } from "@/components/UI/atoms/container";
import { Alert } from "@/components/UI/atoms/alert";
import DateLib from "@/lib/date/DateLib";
import { isGreater } from "@/utils/bn";
import { ComingSoon } from "@/components/pages/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";

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

  const coverKey = toBytes32(cover_id);
  const { coverInfo } = useCoverInfo(coverKey);
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

      {loading && <p className="text-center">Loading...</p>}

      {!loading && !data.incidentReport && (
        <p className="text-center">No data found</p>
      )}

      {data.incidentReport && (
        <div className="border-t border-t-B0C4DB">
          <Container className="py-16">
            {canDispute ? (
              <NewDisputeReportForm incidentReport={data.incidentReport} />
            ) : (
              <Alert>Not applicable for disputing</Alert>
            )}
          </Container>
        </div>
      )}
    </main>
  );
}
