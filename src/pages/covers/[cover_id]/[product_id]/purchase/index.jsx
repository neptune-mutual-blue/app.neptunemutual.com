import Head from "next/head";
import { useRouter } from "next/router";
import { CoverStatsProvider } from "@/common/Cover/CoverStatsContext";

import { CoverPurchaseDetailsPage } from "@/src/modules/cover/purchase";
import { ComingSoon } from "@/common/ComingSoon";
import { isV2BasketCoverEnabled } from "@/src/config/environment";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";

export function getServerSideProps() {
  return {
    props: {
      disabled: !isV2BasketCoverEnabled(),
    },
  };
}

export default function CoverPurchaseDetails({ disabled }) {
  const router = useRouter();
  const { product_id, cover_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);
  const productKey = safeFormatBytes32String(product_id || "");

  if (disabled) {
    return <ComingSoon />;
  }

  return (
    <>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>

      <CoverStatsProvider coverKey={coverKey} productKey={productKey}>
        <CoverPurchaseDetailsPage />
      </CoverStatsProvider>
    </>
  );
}
