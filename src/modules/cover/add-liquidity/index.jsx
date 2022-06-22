import { useState } from "react";
import { useRouter } from "next/router";
import { AcceptRulesForm } from "@/common/AcceptRulesForm/AcceptRulesForm";
import { CoverRules } from "@/common/CoverRules/CoverRules";
import { ProvideLiquidityForm } from "@/common/LiquidityForms/ProvideLiquidityForm";
import { CoverActionsFooter } from "@/common/Cover/CoverActionsFooter";
import { Container } from "@/common/Container/Container";
import { SeeMoreParagraph } from "@/common/SeeMoreParagraph";
import { CoverProfileInfo } from "@/common/CoverProfileInfo/CoverProfileInfo";
import { BreadCrumbs } from "@/common/BreadCrumbs/BreadCrumbs";
import { Hero } from "@/common/Hero";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { t, Trans } from "@lingui/macro";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { LiquidityResolutionSources } from "@/common/LiquidityResolutionSources/LiquidityResolutionSources";
import { useFetchCovers } from "@/src/hooks/useFetchCovers";

export const CoverAddLiquidityDetailsPage = () => {
  const [acceptedRules, setAcceptedRules] = useState(false);
  const router = useRouter();
  const { cover_id, product_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);
  const productKey = safeFormatBytes32String(product_id || "");

  const isBasket = Boolean(product_id);

  const { getInfoByKey, getBasketInfoByKey } = useFetchCovers(
    isBasket ? "basket" : "standalone"
  );

  const coverInfo = !isBasket
    ? getInfoByKey(coverKey)
    : getBasketInfoByKey(coverKey, productKey);

  const {
    info,
    refetch: refetchInfo,
    isWithdrawalWindowOpen,
    accrueInterest,
  } = useMyLiquidityInfo({
    coverKey,
  });

  if (!coverInfo) {
    return <Trans>loading...</Trans>;
  }

  const imgSrc = getCoverImgSrc({ key: coverKey });

  const handleAcceptRules = () => {
    setAcceptedRules(true);
  };

  return (
    <>
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
              { name: t`Provide Liquidity`, current: true },
            ]}
          />
          <div className="flex">
            <CoverProfileInfo
              coverKey={coverKey}
              imgSrc={imgSrc}
              projectName={coverInfo?.coverName}
              links={coverInfo?.links}
            />
          </div>
        </Container>
      </Hero>

      {/* Content */}
      <div className="pt-12 pb-24 border-t border-t-B0C4DB">
        <Container className="grid grid-cols-3 md:gap-32">
          <div className="col-span-3 md:col-span-2">
            {/* Description */}
            <span className="hidden md:block">
              <SeeMoreParagraph text={coverInfo.about}></SeeMoreParagraph>
            </span>

            {acceptedRules ? (
              <div className="mt-12">
                <ProvideLiquidityForm coverKey={coverKey} info={info} />
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

          <LiquidityResolutionSources
            info={info}
            refetchInfo={refetchInfo}
            isWithdrawalWindowOpen={isWithdrawalWindowOpen}
            accrueInterest={accrueInterest}
          />
        </Container>
      </div>

      <CoverActionsFooter activeKey="add-liquidity" />
    </>
  );
};
