import { Container } from "@/common/Container/Container";
import { AcceptRulesForm } from "@/common/AcceptRulesForm/AcceptRulesForm";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { useRouter } from "next/router";
import { CoverActionsFooter } from "@/common/Cover/CoverActionsFooter";
import { CoverPurchaseResolutionSources } from "@/common/Cover/Purchase/CoverPurchaseResolutionSources";
import { SeeMoreParagraph } from "@/common/SeeMoreParagraph";
import { getCoverImgSrc, toBytes32 } from "@/src/helpers/cover";
import { convertFromUnits } from "@/utils/bn";
import { useAvailableLiquidity } from "@/src/hooks/provide-liquidity/useAvailableLiquidity";
import { HeroStat } from "@/common/HeroStat";
import { CoverProfileInfo } from "@/common/CoverProfileInfo/CoverProfileInfo";
import { BreadCrumbs } from "@/common/BreadCrumbs/BreadCrumbs";
import { Hero } from "@/common/Hero";
import { CoverRules } from "@/common/CoverRules/CoverRules";
import { useState } from "react";
import { PurchasePolicyForm } from "@/common/CoverForm/PurchasePolicyForm";
import { formatCurrency } from "@/utils/formatter/currency";
import { t, Trans } from "@lingui/macro";
import { useFetchCoverInfo } from "@/src/hooks/useFetchCoverInfo";

export const CoverPurchaseDetailsPage = () => {
  const [acceptedRules, setAcceptedRules] = useState(false);
  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = toBytes32(cover_id);
  const { coverInfo } = useCoverInfo(coverKey);

  const { availableLiquidity } = useAvailableLiquidity({ coverKey });
  const { totalPoolAmount: totalLiquidity } = useFetchCoverInfo({ coverKey });

  if (!coverInfo) {
    return <>loading...</>;
  }

  const handleAcceptRules = () => {
    setAcceptedRules(true);
  };

  const imgSrc = getCoverImgSrc(coverInfo);

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
          <CoverPurchaseResolutionSources coverInfo={coverInfo}>
            <hr className="mt-4 mb-6 border-t border-B0C4DB/60" />
            <div
              className="flex justify-between pb-2"
              title={formatCurrency(availableLiquidity).long}
            >
              <span className="">
                <Trans>Available Liquidity:</Trans>
              </span>
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
