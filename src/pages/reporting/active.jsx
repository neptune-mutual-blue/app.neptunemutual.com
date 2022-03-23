import Head from "next/head";
import { ReportingTabs } from "@/components/pages/reporting/ReportingTabs";
import { ReportingActivePage } from "@/components/pages/reporting/active";
import { ComingSoon } from "@/components/pages/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";

export function getStaticProps() {
  return {
    props: {
      disabled: !isFeatureEnabled("reporting"),
    },
  };
}

export default function ReportingActive({ disabled }) {
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
      <ReportingTabs active="active">
        <ReportingActivePage />
      </ReportingTabs>
    </main>
  );
}
