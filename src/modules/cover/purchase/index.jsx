import { Container } from "@/common/Container/Container";
import { AcceptRulesForm } from "@/common/AcceptRulesForm/AcceptRulesForm";
import { useRouter } from "next/router";
import { CoverActionsFooter } from "@/common/Cover/CoverActionsFooter";
import { CoverResolutionSources } from "@/common/Cover/CoverResolutionSources";
import { SeeMoreParagraph } from "@/common/SeeMoreParagraph";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { convertFromUnits } from "@/utils/bn";
import { HeroStat } from "@/common/HeroStat";
import { CoverProfileInfo } from "@/common/CoverProfileInfo/CoverProfileInfo";
import { BreadCrumbs } from "@/common/BreadCrumbs/BreadCrumbs";
import { Hero } from "@/common/Hero";
import { CoverRules } from "@/common/CoverRules/CoverRules";
import { useState } from "react";
import { PurchasePolicyForm } from "@/common/CoverForm/PurchasePolicyForm";
import { formatCurrency } from "@/utils/formatter/currency";
import { t, Trans } from "@lingui/macro";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { useCoverStatsContext } from "@/common/Cover/CoverStatsContext";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { useCovers } from "@/src/context/Covers";
import { useAppConstants } from "@/src/context/AppConstants";

export const CoverPurchaseDetailsPage = () => {
  const [acceptedRules, setAcceptedRules] = useState(false);
  const router = useRouter();
  const { cover_id, product_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);
  const productKey = safeFormatBytes32String(product_id || "");
  const { getInfoByKey } = useCovers();
  const coverInfo = getInfoByKey(coverKey);
  const { liquidityTokenDecimals, liquidityTokenSymbol } = useAppConstants();

  console.log("coverKey", coverKey);
  console.log("productKey", productKey);

  const { info } = useMyLiquidityInfo({ coverKey });
  const { availableLiquidity: availableLiquidityInWei } =
    useCoverStatsContext();
  const availableLiquidity = convertFromUnits(
    availableLiquidityInWei,
    liquidityTokenDecimals
  ).toString();

  if (!coverInfo) {
    return <Trans>loading...</Trans>;
  }

  const handleAcceptRules = () => {
    setAcceptedRules(true);
  };

  const imgSrc = getCoverImgSrc({ key: coverKey });
  const totalLiquidity = info.totalLiquidity;

  return (
    <main>
      {/* hero */}
      <Hero>
        <Container className="px-2 py-20">
          <BreadCrumbs
            pages={[
              { name: t`Home`, href: "/", current: false },
              {
                name: coverInfo?.coverName,
                href: `/cover/${cover_id}/options`,
                current: false,
              },
              { name: t`Purchase Policy`, current: true },
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
            <HeroStat title={t`Total Liquidity`}>
              {
                formatCurrency(
                  convertFromUnits(totalLiquidity, liquidityTokenDecimals),
                  router.locale,
                  liquidityTokenSymbol,
                  true
                ).long
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
                <AcceptRulesForm
                  onAccept={handleAcceptRules}
                  coverKey={coverKey}
                >
                  <Trans>
                    I have read, understood, and agree to the terms of cover
                    rules
                  </Trans>
                </AcceptRulesForm>
              </>
            )}
          </div>

          <span className="block col-span-3 row-start-1 md:hidden mb-11">
            <SeeMoreParagraph text={coverInfo.about}></SeeMoreParagraph>
          </span>
          <CoverResolutionSources coverInfo={coverInfo}>
            <hr className="mt-4 mb-6 border-t border-B0C4DB/60" />
            <div
              className="flex justify-between pb-2"
              title={formatCurrency(availableLiquidity, router.locale).long}
            >
              <span className="">
                <Trans>Available Liquidity:</Trans>
              </span>
              <strong className="font-bold text-right">
                {formatCurrency(availableLiquidity, router.locale).short}
              </strong>
            </div>
          </CoverResolutionSources>
        </Container>
      </div>

      <CoverActionsFooter activeKey="purchase" />
    </main>
  );
};
