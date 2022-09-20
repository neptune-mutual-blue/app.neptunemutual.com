import Head from "next/head";
import { CoverOptionsPage } from "@/src/modules/cover/CoverOptionsPage";
import { useRouter } from "next/router";
import { Container } from "@/common/Container/Container";
import { BreadCrumbs } from "@/common/BreadCrumbs/BreadCrumbs";
import { t } from "@lingui/macro";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";

export default function Options() {
  const router = useRouter();
  const { cover_id, product_id } = router.query;

  const coverKey = safeFormatBytes32String(cover_id);
  const productKey = safeFormatBytes32String(product_id || "");

  const coverInfo = useCoverOrProductData({ coverKey, productKey });

  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>

      <Container className="pt-9">
        <BreadCrumbs
          pages={[
            { name: t`Home`, href: "/", current: false },
            {
              name: coverInfo?.infoObj?.coverName || t`loading..`,
              href: `/covers/${cover_id}`,
              current: true,
            },
          ]}
        />
      </Container>
      <CoverOptionsPage />
    </main>
  );
}
