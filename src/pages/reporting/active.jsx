import Head from "next/head";
import { ReportingTabs } from "@/src/modules/reporting/ReportingTabs";
import { ReportingActivePage } from "@/src/modules/reporting/active/active";
import { ComingSoon } from "@/common/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";
import { SortableStatsProvider } from "@/src/context/SortableStatsContext";
import { generateNonce, setCspHeaderWithNonce } from "@/utils/cspHeader";

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
        <SortableStatsProvider>
          <ReportingActivePage />
        </SortableStatsProvider>
      </ReportingTabs>
    </main>
  );
}

export const getServerSideProps = async ({ req: _, res }) => {
  const nonce = generateNonce();

  setCspHeaderWithNonce(res, nonce);

  return {
    props: {
      nonce,
      disabled: !isFeatureEnabled("reporting"),
    },
  };
};
