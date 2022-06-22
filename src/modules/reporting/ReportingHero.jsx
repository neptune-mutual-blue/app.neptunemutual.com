import { BreadCrumbs } from "@/common/BreadCrumbs/BreadCrumbs";
import { Container } from "@/common/Container/Container";
import { Hero } from "@/common/Hero";
import { CoverProfileInfo } from "@/common/CoverProfileInfo/CoverProfileInfo";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useRouter } from "next/router";
import { t } from "@lingui/macro";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";

export const ReportingHero = ({ coverInfo, reportStatus }) => {
  const router = useRouter();
  const { cover_id, product_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);
  // const productKey = safeFormatBytes32String(product_id || "");
  const imgSrc = getCoverImgSrc({ key: coverKey });

  const breadcrumbData = reportStatus
    ? [
        { name: t`Home`, href: "/", current: false },
        {
          name: t`Reporting`,
          href: `/reporting/${reportStatus.resolved ? "resolved" : "active"}`,
          current: false,
        },
        {
          name: coverInfo?.coverName,
          current: !Boolean(reportStatus.dispute),
          href: reportStatus.dispute
            ? router.asPath.replace("/dispute", "/details")
            : "",
        },
      ]
    : [
        { name: t`Home`, href: "/", current: false },
        {
          name: coverInfo?.coverName,
          href: product_id
            ? `/covers/${cover_id}/${product_id}/options`
            : `/covers/${cover_id}/options`,
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
            imgSrc={imgSrc}
            links={coverInfo?.links}
            projectName={coverInfo?.coverName}
          />
        </div>
      </Container>
    </Hero>
  );
};
