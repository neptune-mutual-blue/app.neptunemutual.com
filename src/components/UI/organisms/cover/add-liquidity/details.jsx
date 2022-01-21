import { Container } from "@/components/UI/atoms/container";
import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { CoverActionsFooter } from "@/components/UI/organisms/cover/actions-footer";
import { CoverPurchaseResolutionSources } from "@/components/UI/organisms/cover/purchase/resolution-sources";
import { useRouter } from "next/router";
import SeeMoreParagraph from "@/components/UI/molecules/see-more-paragraph";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { Hero } from "@/components/UI/molecules/Hero";
import { BreadCrumbs } from "@/components/UI/atoms/breadcrumbs";
import { CoverProfileInfo } from "@/components/common/CoverProfileInfo";
import { HeroStat } from "@/components/UI/molecules/HeroStat";

export const CoverAddLiquidityDetailsPage = ({ children }) => {
  const router = useRouter();
  const { cover_id } = router.query;
  const { coverInfo } = useCoverInfo(cover_id);

  if (!coverInfo) {
    return <>loading...</>;
  }

  const imgSrc = getCoverImgSrc(coverInfo);

  return (
    <>
      {/* hero */}
      <Hero>
        <Container className="px-2 py-20">
          <BreadCrumbs
            pages={[
              { name: "Home", href: "/", current: false },
              { name: coverInfo?.coverName, current: false },
              { name: "Provide Liquidity", href: "#", current: true },
            ]}
          />
          <div className="flex">
            <CoverProfileInfo
              imgSrc={imgSrc}
              projectName={coverInfo?.coverName}
              links={coverInfo?.links}
            />

            {/* Total Liquidity */}
            <HeroStat title="My Liquidity">
              <>5,234,759.00 DAI</>
            </HeroStat>
          </div>
        </Container>
      </Hero>

      {/* Content */}
      <div className="pt-12 pb-24 border-t border-t-B0C4DB">
        <Container className="grid gap-32 grid-cols-3">
          <div className="col-span-2">
            {/* Description */}
            <SeeMoreParagraph>{coverInfo.about}</SeeMoreParagraph>

            {children}
          </div>

          <CoverPurchaseResolutionSources
            projectName={coverInfo.projectName}
            knowledgebase={coverInfo?.resolutionSources[1]}
            twitter={coverInfo?.resolutionSources[0]}
          >
            <hr className="mt-4 mb-6 border-t border-B0C4DB/60" />
            <div className="flex justify-between pb-2">
              <span className="">Total Liquidity:</span>
              <strong className="text-right font-bold">$ 2.5M</strong>
            </div>
            <div className="flex justify-between">
              <span className="">Reassurance:</span>
              <strong className="text-right font-bold">$ 750k</strong>
            </div>
          </CoverPurchaseResolutionSources>
        </Container>
      </div>

      <CoverActionsFooter activeKey="add-liquidity" />
    </>
  );
};
