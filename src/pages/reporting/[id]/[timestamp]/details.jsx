import Head from "next/head";
import { useRouter } from "next/router";
import { useFetchReport } from "@/src/hooks/useFetchReport";
import { ReportingDetailsPage } from "@/components/pages/reporting/details";
import { toBytes32 } from "@/src/helpers/cover";
import PageNotFound from "@/src/pages/404";

// This gets called on every request
export async function getServerSideProps() {
  // Pass data to the page via props
  return {
    props: {
      disabled: !!process.env.NEXT_PUBLIC_DISABLE_REPORTING,
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
