import { Container } from "@/components/UI/atoms/container";
import { AcceptRulesForm } from "@/components/UI/organisms/accept-rules-form";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { useRouter } from "next/router";
import { CoverActionsFooter } from "@/components/UI/organisms/cover/actions-footer";
import { CoverPurchaseResolutionSources } from "@/components/UI/organisms/cover/purchase/resolution-sources";
import { SeeMoreParagraph } from "@/components/UI/molecules/SeeMoreParagraph";
import { getCoverImgSrc, getParsedKey, toBytes32 } from "@/src/helpers/cover";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { convertFromUnits, sumOf } from "@/utils/bn";
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
  const totalLiquidity = sumOf(info.balance, info.extendedBalance);

  const parsedCoverKey = getParsedKey(coverInfo.key);

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
                href: `/cover/${parsedCoverKey}/options`,
                current: false,
              },
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
        <Container className="grid gap-32 grid-cols-3">
          <div className="col-span-2">
            <SeeMoreParagraph text={coverInfo.about}></SeeMoreParagraph>

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

          <CoverPurchaseResolutionSources coverInfo={coverInfo}>
            <hr className="mt-4 mb-6 border-t border-B0C4DB/60" />
            <div
              className="flex justify-between"
              title={formatCurrency(availableLiquidity).long}
            >
              <span className="">Available Liquidity:</span>
              <strong className="text-right font-bold">
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
