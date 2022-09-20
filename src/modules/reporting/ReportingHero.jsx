import { BreadCrumbs } from "@/common/BreadCrumbs/BreadCrumbs";
import { Container } from "@/common/Container/Container";
import { Hero } from "@/common/Hero";
import { CoverProfileInfo } from "@/common/CoverProfileInfo/CoverProfileInfo";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useRouter } from "next/router";
import { t } from "@lingui/macro";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { isValidProduct } from "@/src/helpers/cover";

export const ReportingHero = ({ coverInfo, reportStatus = null }) => {
  const router = useRouter();
  const { cover_id, product_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);
  const productKey = safeFormatBytes32String(product_id || "");
  const isDiversified = isValidProduct(productKey);
  const imgSrc = getCoverImgSrc({ key: isDiversified ? productKey : coverKey });

  const breadcrumbData = reportStatus
    ? [
        { name: t`Home`, href: "/", current: false },
        {
          name: t`Reporting`,
          href: `/reports/${reportStatus.resolved ? "resolved" : "active"}`,
          current: false,
        },
        {
          name: isDiversified
            ? coverInfo?.infoObj.productName
            : coverInfo?.infoObj.coverName,
          current: !Boolean(reportStatus.dispute),
          href: reportStatus.dispute
            ? router.asPath.replace("/dispute", "/details")
            : "",
        },
      ]
    : [
        { name: t`Home`, href: "/", current: false },
        {
          name: isDiversified
            ? coverInfo?.infoObj.productName
            : coverInfo?.infoObj.coverName,
          href: product_id
            ? `/covers/${cover_id}/products/${product_id}`
            : `/covers/${cover_id}`,
          current: false,
        },
        { name: t`Reporting`, current: true },
      ];

  if (reportStatus?.dispute) {
    breadcrumbData.push({
      name: "Dispute",
      current: true,
    });
  }

  return (
    <Hero>
      <Container className="px-2 py-20">
        <BreadCrumbs pages={breadcrumbData} />
        <div className="flex">
          <CoverProfileInfo
            coverKey={coverKey}
            productKey={productKey}
            imgSrc={imgSrc}
            links={coverInfo?.infoObj.links}
            projectName={
              isDiversified
                ? coverInfo?.infoObj.productName
                : coverInfo?.infoObj.coverName
            }
          />
        </div>
      </Container>
    </Hero>
  );
};
