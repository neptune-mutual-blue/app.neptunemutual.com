import { useRouter } from "next/router";
import { ComingSoon } from "@/common/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";
import { CoverStatsProvider } from "@/common/Cover/CoverStatsContext";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { NewIncidentReportPage } from "@/modules/reporting/new";
import { generateNonce, setCspHeaderWithNonce } from "@/utils/cspHeader";

export default function ReportingNewCoverPage({ disabled }) {
  const router = useRouter();
  const { cover_id, product_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);
  const productKey = safeFormatBytes32String(product_id || "");

  if (disabled) {
    return <ComingSoon />;
  }

  return (
    <CoverStatsProvider coverKey={coverKey} productKey={productKey}>
      <NewIncidentReportPage />
    </CoverStatsProvider>
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
