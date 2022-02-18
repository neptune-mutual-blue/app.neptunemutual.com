import { BreadCrumbs } from "@/components/UI/atoms/breadcrumbs";
import { Container } from "@/components/UI/atoms/container";
import { Hero } from "@/components/UI/molecules/Hero";
import { CoverProfileInfo } from "@/components/common/CoverProfileInfo";
import { getCoverImgSrc, getParsedKey } from "@/src/helpers/cover";

export const ReportingHero = ({ coverInfo, reportStatus }) => {
  const imgSrc = getCoverImgSrc(coverInfo);

  const parsedCoverKey = getParsedKey(coverInfo.key);
  return (
    <Hero>
      <Container className="px-2 py-20">
        <BreadCrumbs
          pages={
            reportStatus
              ? [
                  { name: "Home", href: "/", current: false },
                  {
                    name: "Reporting",
                    href: `/reporting/${
                      reportStatus.resolved ? "resolved" : "active"
                    }`,
                    current: false,
                  },
                  {
                    name: coverInfo?.coverName,
                    current: true,
                  },
                ]
              : [
                  { name: "Home", href: "/", current: false },
                  {
                    name: coverInfo?.coverName,
                    href: `/cover/${parsedCoverKey}/options`,
                    current: false,
                  },
                  { name: "Reporting", href: "#", current: true },
                ]
          }
        />
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
