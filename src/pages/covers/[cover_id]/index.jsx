import Head from "next/head";
import { CoverOptionsPage } from "@/src/modules/cover/CoverOptionsPage";
import { useRouter } from "next/router";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";
import { HomeHero } from "@/modules/home/Hero";
import { ProductsGrid } from "@/common/ProductsGrid/ProductsGrid";
import { isV2BasketCoverEnabled } from "@/src/config/environment";
import { ComingSoon } from "@/common/ComingSoon";

const disabled = !isV2BasketCoverEnabled();

export default function CoverPage() {
  const router = useRouter();
  const { cover_id, product_id } = router.query;

  const coverKey = safeFormatBytes32String(cover_id);
  const productKey = safeFormatBytes32String(product_id || "");

  const coverInfo = useCoverOrProductData({ coverKey, productKey });

  const isDiversified = coverInfo?.supportsProducts;

  if (disabled && isDiversified) {
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

      {isDiversified ? (
        <>
          <HomeHero />
          <ProductsGrid />
        </>
      ) : (
        <CoverOptionsPage
          coverKey={coverKey}
          productKey={productKey}
          coverProductInfo={coverInfo}
          isDiversified={isDiversified}
        />
      )}
    </main>
  );
}
