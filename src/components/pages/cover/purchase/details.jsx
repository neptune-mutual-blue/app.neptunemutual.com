import { Container } from "@/components/UI/atoms/container";
import { AcceptRulesForm } from "@/components/UI/organisms/accept-rules-form";
import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { useRouter } from "next/router";
import { CoverActionsFooter } from "@/components/UI/organisms/cover/actions-footer";
import { CoverPurchaseResolutionSources } from "@/components/UI/organisms/cover/purchase/resolution-sources";
import SeeMoreParagraph from "@/components/UI/molecules/see-more-paragraph";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { sumOf, weiAsAmount } from "@/utils/bn";
import { useAvailableLiquidity } from "@/src/hooks/provide-liquidity/useAvailableLiquidity";
import { HeroStat } from "@/components/UI/molecules/HeroStat";
import { CoverProfileInfo } from "@/components/common/CoverProfileInfo";
import { BreadCrumbs } from "@/components/UI/atoms/breadcrumbs";
import { Hero } from "@/components/UI/molecules/Hero";
import { liquidityTokenSymbol } from "@/src/config/constants";
import { CoverRules } from "@/components/common/CoverRules";

export const CoverPurchaseDetailsPage = () => {
  const router = useRouter();
  const { cover_id: coverKey } = router.query;
  const { coverInfo } = useCoverInfo(coverKey);

  const { availableLiquidity } = useAvailableLiquidity({ coverKey });
  const { info } = useMyLiquidityInfo({ coverKey });

  if (!coverInfo) {
    return <>loading...</>;
  }

  const imgSrc = getCoverImgSrc(coverInfo);

  const handleAcceptRules = () => {
    router.push(`/cover/${coverKey}/purchase/checkout`);
  };

  const totalLiquidity = sumOf(info.balance, info.extendedBalance);

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
              {weiAsAmount(totalLiquidity)} {liquidityTokenSymbol}
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

            {/* Rules */}
            <CoverRules rules={coverInfo?.rules} />

            <br className="mt-20" />

            <AcceptRulesForm onAccept={handleAcceptRules}>
              I have read, understood, and agree to the terms of cover rules
            </AcceptRulesForm>
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
