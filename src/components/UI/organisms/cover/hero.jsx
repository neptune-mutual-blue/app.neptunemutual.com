import { Container } from "@/components/UI/atoms/container";
import { SocialIconLinks } from "@/components/UI/molecules/social-icon-links";
import { CoverHeroImage } from "@/components/UI/molecules/cover/hero/image";
import { CoverHeroTitleAndWebsite } from "@/components/UI/molecules/cover/hero/title-and-website";
import { BreadCrumbs } from "@/components/UI/atoms/breadcrumbs";
import { Hero } from "@/components/UI/molecules/Hero";
import { HeroStat } from "@/components/UI/molecules/HeroStat";

export const CoverHero = ({ coverInfo, imgSrc, title, hasTotalLiquidity, pageName = "Purchase Policy" }) => {
  return (
    <Hero>
      <Container className="px-2 py-20">
        <BreadCrumbs
          pages={[
            { name: "Home", href: "/", current: false },
            { name: "Clearpool", current: false },
            { name: pageName, href: "#", current: true },
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

          {/* Total Liquidity */}
          {hasTotalLiquidity
            ? (
              <HeroStat title="Total Liquidity">
                <>5,234,759.00 DAI</>
              </HeroStat>
            ): null}
        </div>
      </Container>
    </Hero>
  );
};