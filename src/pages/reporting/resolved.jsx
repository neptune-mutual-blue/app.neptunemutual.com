import Head from "next/head";
import { ReportingTabs } from "@/src/modules/reporting/ReportingTabs";
import { ReportingResolvedPage } from "@/src/modules/reporting/resolved/resolved";
import { ComingSoon } from "@/common/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";
import { SortableStatsProvider } from "@/src/context/SortableStatsContext";
import { generateNonce, setCspHeaderWithNonce } from "@/utils/cspHeader";

export default function ReportingResolved({ disabled }) {
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
      <ReportingTabs active="resolved">
        <SortableStatsProvider>
          <ReportingResolvedPage />
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
