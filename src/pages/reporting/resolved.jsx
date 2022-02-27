import Head from "next/head";
import { ReportingTabs } from "@/components/pages/reporting/ReportingTabs";
import { ReportingResolvedPage } from "@/components/pages/reporting/resolved";

export default function ReportingResolved() {
  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>
      <ReportingTabs active="resolved">
        <ReportingResolvedPage />
      </ReportingTabs>
    </main>
  );
}
