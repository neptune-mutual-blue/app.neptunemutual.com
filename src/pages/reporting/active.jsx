import Head from "next/head";
import { ReportingTabs } from "@/components/pages/reporting/ReportingTabs";
import { ReportingActivePage } from "@/components/pages/reporting/active";
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

export default function ReportingActive({ disabled }) {
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
      <ReportingTabs active="active">
        <ReportingActivePage />
      </ReportingTabs>
    </main>
  );
}
