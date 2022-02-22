import { BreadCrumbs } from "@/components/UI/atoms/breadcrumbs";
import { Container } from "@/components/UI/atoms/container";
import { Hero } from "@/components/UI/molecules/Hero";
import { CoverProfileInfo } from "@/components/common/CoverProfileInfo";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useRouter } from "next/router";

export const ReportingHero = ({ coverInfo, reportStatus }) => {
  const imgSrc = getCoverImgSrc(coverInfo);
  const router = useRouter();
  const cover_id = router.query?.id;

  const breadcrumbData = reportStatus
    ? [
        { name: "Home", href: "/", current: false },
        {
          name: "Reporting",
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
        { name: "Home", href: "/", current: false },
        {
          name: coverInfo?.coverName,
          href: `/cover/${cover_id}/options`,
          current: false,
        },
        { name: "Reporting", current: true },
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
            imgSrc={imgSrc}
            links={coverInfo?.links}
            projectName={coverInfo?.coverName}
          />
        </div>
      </Container>
    </Hero>
  );
};
