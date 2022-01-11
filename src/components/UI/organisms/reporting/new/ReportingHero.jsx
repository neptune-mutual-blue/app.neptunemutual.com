import { BreadCrumbs } from "@/components/UI/atoms/breadcrumbs";
import { Container } from "@/components/UI/atoms/container";
import { CoverHeroImage } from "@/components/UI/molecules/cover/hero/image";
import { CoverHeroTitleAndWebsite } from "@/components/UI/molecules/cover/hero/title-and-website";
import { Hero } from "@/components/UI/molecules/Hero";
import { SocialIconLinks } from "@/components/UI/molecules/social-icon-links";

export const ReportingHero = ({ coverInfo, imgSrc, title }) => {
  return (
    <Hero>
      <Container className="px-2 py-20">
        <BreadCrumbs
          pages={[
            { name: "Reporting", href: "/reporting", current: false },
            { name: "Compound", current: true },
          ]}
        />
        <div className="flex">
          <div>
            <CoverHeroImage imgSrc={imgSrc} title={title} />
          </div>
          <div>
            <CoverHeroTitleAndWebsite links={coverInfo.links} title={title} />
            <SocialIconLinks links={coverInfo.links} />
          </div>
        </div>
      </Container>
    </Hero>
  );
};
