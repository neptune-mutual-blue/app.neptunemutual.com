import { Container } from "@/components/UI/atoms/container";
import { SocialIconLinks } from "@/components/UI/molecules/social-icon-links";
import { CoverHeroTotalLiquidity } from "@/components/UI/molecules/cover/hero/total-liquidity";
import { CoverHeroImage } from "@/components/UI/molecules/cover/hero/image";
import { CoverHeroTitleAndWebsite } from "@/components/UI/molecules/cover/hero/title-and-website";
import { BreadCrumbs } from "@/components/UI/atoms/breadcrumbs";

export const CoverHero = ({ coverInfo, imgSrc, title, pageName = "Purchase Policy", hasTotalLiquidity = true }) => {
  return (
    <div
      className="px-8 py-6"
      style={{
        backgroundImage: "url(/gradient.png)",
        backgroundSize: "cover",
        backgroundPosition: "left",
      }}
    >
      <div className="py-14">
        <Container>
          <BreadCrumbs
            pages={[
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
              ? (<CoverHeroTotalLiquidity />)
              : null
            }
          </div>
        </Container>
      </div>
    </div>
  );
};
