import { Container } from "@/components/UI/atoms/container";
import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { PurchasePolicyForm } from "@/components/UI/organisms/cover-form/PurchasePolicyForm";
import { CoverActionsFooter } from "@/components/UI/organisms/cover/actions-footer";
import { CoverPurchaseResolutionSources } from "@/components/UI/organisms/cover/purchase/resolution-sources";
import { useRouter } from "next/router";
import SeeMoreParagraph from "@/components/UI/molecules/see-more-paragraph";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { sumOf } from "@/utils/bn";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { useAvailableLiquidity } from "@/src/hooks/provide-liquidity/useAvailableLiquidity";
import { HeroStat } from "@/components/UI/molecules/HeroStat";
import { CoverProfileInfo } from "@/components/common/CoverProfileInfo";
import { BreadCrumbs } from "@/components/UI/atoms/breadcrumbs";
import { Hero } from "@/components/UI/molecules/Hero";
import { liquidityTokenSymbol } from "@/src/config/constants";

export const CoverPurchaseCheckoutPage = () => {
  const router = useRouter();
  const { cover_id } = router.query;
  const { coverInfo } = useCoverInfo(cover_id);

  const { availableLiquidity } = useAvailableLiquidity({
    coverKey: cover_id,
  });
  const { info } = useMyLiquidityInfo({
    coverKey: cover_id,
  });

  if (!coverInfo) {
    return <>loading...</>;
  }

  const imgSrc = getCoverImgSrc(coverInfo);

  return (
    <main>
      {/* hero */}
      <Hero>
        <Container className="px-2 py-20">
          <BreadCrumbs
            pages={[
              { name: "Home", href: "/", current: false },
              { name: coverInfo?.coverName, current: false },
              { name: "Purchase Policy", href: "#", current: true },
            ]}
          />
          <div className="flex">
            <CoverProfileInfo
              imgSrc={imgSrc}
              projectName={coverInfo?.coverName}
              links={coverInfo?.links}
            />

            {/* Total Liquidity */}
            <HeroStat title="Total Liquidity">
              {sumOf(info.balance, info.extendedBalance)
                .decimalPlaces(2)
                .toString()}{" "}
              {liquidityTokenSymbol}
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

            <br className="mt-20" />

            <div className="mt-12">
              <PurchasePolicyForm coverKey={cover_id} />
            </div>
          </div>

          <CoverPurchaseResolutionSources
            projectName={coverInfo.projectName}
            knowledgebase={coverInfo?.resolutionSources[1]}
            twitter={coverInfo?.resolutionSources[0]}
            availableLiquidity={availableLiquidity}
          />
        </Container>
      </div>

      <CoverActionsFooter activeKey="purchase" />
    </main>
  );
};
