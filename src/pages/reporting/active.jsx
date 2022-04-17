import Head from "next/head";
import { ReportingTabs } from "@/src/modules/reporting/ReportingTabs";
import { ReportingActivePage } from "@/src/modules/reporting/active/active";
import { ComingSoon } from "@/src/common/components/ComingSoon";
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
