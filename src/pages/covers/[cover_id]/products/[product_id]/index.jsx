import Head from "next/head";
import { CoverOptionsPage } from "@/src/modules/cover/CoverOptionsPage";
import { isV2BasketCoverEnabled } from "@/src/config/environment";
import { ComingSoon } from "@/common/ComingSoon";
import { useRouter } from "next/router";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";

const disabled = !isV2BasketCoverEnabled();

export default function Options() {
  const router = useRouter();
  const { cover_id, product_id } = router.query;

  const coverKey = safeFormatBytes32String(cover_id);
  const productKey = safeFormatBytes32String(product_id || "");

  const productInfo = useCoverOrProductData({ coverKey, productKey });

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

      <CoverOptionsPage
        coverKey={coverKey}
        productKey={productKey}
        coverProductInfo={productInfo}
        isDiversified={true}
      />
    </main>
  );
}
