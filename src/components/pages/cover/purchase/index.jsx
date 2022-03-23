import { Container } from "@/components/UI/atoms/container";
import { AcceptRulesForm } from "@/components/UI/organisms/accept-rules-form";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { useRouter } from "next/router";
import { CoverActionsFooter } from "@/components/UI/organisms/cover/actions-footer";
import { CoverPurchaseResolutionSources } from "@/components/UI/organisms/cover/purchase/resolution-sources";
import { SeeMoreParagraph } from "@/components/UI/molecules/SeeMoreParagraph";
import { getCoverImgSrc, toBytes32 } from "@/src/helpers/cover";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { convertFromUnits } from "@/utils/bn";
import { useAvailableLiquidity } from "@/src/hooks/provide-liquidity/useAvailableLiquidity";
import { HeroStat } from "@/components/UI/molecules/HeroStat";
import { CoverProfileInfo } from "@/components/common/CoverProfileInfo";
import { BreadCrumbs } from "@/components/UI/atoms/breadcrumbs";
import { Hero } from "@/components/UI/molecules/Hero";
import { CoverRules } from "@/components/common/CoverRules";
import { useState } from "react";
import { PurchasePolicyForm } from "@/components/UI/organisms/cover-form/PurchasePolicyForm";
import { formatCurrency } from "@/utils/formatter/currency";

export const CoverPurchaseDetailsPage = () => {
  const [acceptedRules, setAcceptedRules] = useState(false);
  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = toBytes32(cover_id);
  const { coverInfo } = useCoverInfo(coverKey);

  const { availableLiquidity } = useAvailableLiquidity({ coverKey });
  const { info } = useMyLiquidityInfo({ coverKey });

  if (!coverInfo) {
    return <>loading...</>;
  }

  const handleAcceptRules = () => {
    setAcceptedRules(true);
  };

  const imgSrc = getCoverImgSrc(coverInfo);
  const totalLiquidity = info.vaultStablecoinBalance;

  return (
    <main>
      {/* hero */}
      <Hero>
        <Container className="px-2 py-20">
          <BreadCrumbs
            pages={[
              { name: "Home", href: "/", current: false },
              {
                name: coverInfo?.coverName,
                href: `/cover/${cover_id}/options`,
                current: false,
              },
              { name: "Purchase Policy", current: true },
            ]}
          />
          <div className="flex flex-wrap">
            <CoverProfileInfo
              coverKey={coverKey}
              imgSrc={imgSrc}
              projectName={coverInfo?.coverName}
              links={coverInfo?.links}
            />

            {/* Total Liquidity */}
            <HeroStat title="Total Liquidity">
              {
                formatCurrency(convertFromUnits(totalLiquidity), "DAI", true)
                  .long
              }
            </HeroStat>
          </div>
        </Container>
      </Hero>

      {/* Content */}
      <div className="pt-12 pb-24 border-t border-t-B0C4DB">
        <Container className="grid grid-cols-3 md:gap-32">
          <div className="col-span-3 md:col-span-2">
            <span className="hidden md:block">
              <SeeMoreParagraph text={coverInfo.about}></SeeMoreParagraph>
            </span>
            {acceptedRules ? (
              <div className="mt-12">
                <PurchasePolicyForm coverKey={coverKey} />
              </div>
            ) : (
              <>
                <CoverRules rules={coverInfo?.rules} />
                <br className="mt-20" />
                <AcceptRulesForm onAccept={handleAcceptRules}>
                  I have read, understood, and agree to the terms of cover rules
                </AcceptRulesForm>
              </>
            )}
          </div>

          <span className="block col-span-3 row-start-1 md:hidden mb-11">
            <SeeMoreParagraph text={coverInfo.about}></SeeMoreParagraph>
          </span>
          <CoverPurchaseResolutionSources coverInfo={coverInfo}>
            <hr className="mt-4 mb-6 border-t border-B0C4DB/60" />
            <div
              className="flex justify-between pb-2"
              title={formatCurrency(availableLiquidity).long}
            >
              <span className="">Available Liquidity:</span>
              <strong className="font-bold text-right">
                {formatCurrency(availableLiquidity).short}
              </strong>
            </div>
          </CoverPurchaseResolutionSources>
        </Container>
      </div>

      <CoverActionsFooter activeKey="purchase" />
    </main>
  );
};
