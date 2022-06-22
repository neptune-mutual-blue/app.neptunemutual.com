import { useRouter } from "next/router";
import { ComingSoon } from "@/common/ComingSoon";
import { isV2BasketCoverEnabled } from "@/src/config/environment";
import { CoverStatsProvider } from "@/common/Cover/CoverStatsContext";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { NewIncidentReportPage } from "@/modules/reporting/new";

export function getServerSideProps() {
  return {
    props: {
      disabled: !isV2BasketCoverEnabled(),
    },
  };
}

export default function ReportingNewCoverPage({ disabled }) {
  const router = useRouter();
  const { product_id, cover_id } = router.query;
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
