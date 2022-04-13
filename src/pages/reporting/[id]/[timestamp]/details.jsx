import Head from "next/head";
import { useRouter } from "next/router";
import { useFetchReport } from "@/src/hooks/useFetchReport";
import { ReportingDetailsPage } from "@/src/modules/reporting/details";
import { toBytes32 } from "@/src/helpers/cover";
import { ComingSoon } from "@/components/pages/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";

export function getServerSideProps() {
  return {
    props: {
      disabled: !isFeatureEnabled("reporting"),
    },
  };
}

export default function IncidentResolvedCoverPage({ disabled }) {
  const router = useRouter();
  const { id: cover_id, timestamp } = router.query;

  const coverKey = toBytes32(cover_id);
  const { data, loading, refetch } = useFetchReport({
    coverKey: coverKey,
    incidentDate: timestamp,
  });

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

      {loading && <p className="text-center">Loading...</p>}

      {!data.incidentReport && <p className="text-center">No data found</p>}

      {data.incidentReport && (
        <ReportingDetailsPage
          incidentReport={data.incidentReport}
          refetchReport={refetch}
        />
      )}
    </main>
  );
}
