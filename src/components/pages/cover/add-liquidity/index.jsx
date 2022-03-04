import { useState } from "react";
import { useRouter } from "next/router";

import { useCoverInfo } from "@/src/hooks/useCoverInfo";

import { AcceptRulesForm } from "@/components/UI/organisms/accept-rules-form";
import { CoverRules } from "@/components/common/CoverRules";
import { ProvideLiquidityForm } from "@/components/UI/organisms/cover-form/ProvideLiquidityForm";
import { CoverActionsFooter } from "@/components/UI/organisms/cover/actions-footer";
import { Container } from "@/components/UI/atoms/container";
import { SeeMoreParagraph } from "@/components/UI/molecules/SeeMoreParagraph";
import { CoverProfileInfo } from "@/components/common/CoverProfileInfo";
import { BreadCrumbs } from "@/components/UI/atoms/breadcrumbs";
import { Hero } from "@/components/UI/molecules/Hero";
import { getCoverImgSrc, toBytes32 } from "@/src/helpers/cover";
import { CoverPurchaseResolutionSources } from "@/components/UI/organisms/cover/purchase/resolution-sources";
import { convertFromUnits, sumOf } from "@/utils/bn";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { formatCurrency } from "@/utils/formatter/currency";
import { useFetchCoverStats } from "@/src/hooks/useFetchCoverStats";

export const CoverAddLiquidityDetailsPage = () => {
  const [acceptedRules, setAcceptedRules] = useState(false);

  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = toBytes32(cover_id);
  const { coverInfo } = useCoverInfo(coverKey);
  const { info, minNpmStake } = useMyLiquidityInfo({ coverKey });
  const {
    data: { status },
  } = useFetchCoverStats({ coverKey });

  const handleAcceptRules = () => {
    setAcceptedRules(true);
  };

  if (!coverInfo) {
    return <>loading...</>;
  }

  const imgSrc = getCoverImgSrc(coverInfo);

  const totalLiquidity = sumOf(info.balance, info.extendedBalance);
  const reassuranceAmount = info.totalReassurance;

  return (
    <>
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
              { name: "Provide Liquidity", current: true },
            ]}
          />
          <div className="flex">
            <CoverProfileInfo
              status={status}
              imgSrc={imgSrc}
              projectName={coverInfo?.coverName}
              links={coverInfo?.links}
            />
          </div>
        </Container>
      </Hero>

      {/* Content */}
      <div className="pt-12 pb-24 border-t border-t-B0C4DB">
        <Container className="grid md:gap-32 grid-cols-3">
          <div className="col-span-3 md:col-span-2">
            {/* Description */}
            <span className="hidden md:block">
              <SeeMoreParagraph text={coverInfo.about}></SeeMoreParagraph>
            </span>

            {acceptedRules ? (
              <div className="mt-12">
                <ProvideLiquidityForm
                  coverKey={coverKey}
                  info={info}
                  minNpmStake={minNpmStake}
                />
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

          <span className="block md:hidden row-start-1 col-span-3 mb-11">
            <SeeMoreParagraph text={coverInfo.about}></SeeMoreParagraph>
          </span>
          <CoverPurchaseResolutionSources coverInfo={coverInfo}>
            <hr className="mt-4 mb-6 border-t border-B0C4DB/60" />
            <div
              className="flex justify-between pb-2"
              title={formatCurrency(convertFromUnits(totalLiquidity)).long}
            >
              <span className="">Total Liquidity:</span>
              <strong className="text-right font-bold">
                {formatCurrency(convertFromUnits(totalLiquidity)).short}
              </strong>
            </div>
            <div
              className="flex justify-between"
              title={formatCurrency(convertFromUnits(reassuranceAmount)).long}
            >
              <span className="">Reassurance:</span>
              <strong className="text-right font-bold">
                {formatCurrency(convertFromUnits(reassuranceAmount)).short}
              </strong>
            </div>
          </CoverPurchaseResolutionSources>
        </Container>
      </div>

      <CoverActionsFooter activeKey="add-liquidity" />
    </>
  );
};
