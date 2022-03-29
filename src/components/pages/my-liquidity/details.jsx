import { useState } from "react";
import { useRouter } from "next/router";
import { Container } from "@/components/UI/atoms/container";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { BreadCrumbs } from "@/components/UI/atoms/breadcrumbs";
import { Hero } from "@/components/UI/molecules/Hero";
import { HeroStat } from "@/components/UI/molecules/HeroStat";
import { CoverPurchaseResolutionSources } from "@/components/UI/organisms/cover/purchase/resolution-sources";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { WithdrawLiquidityModal } from "@/components/LiquidityForms/WithdrawLiquidityModal";
import { ModalTitle } from "@/components/UI/molecules/modal/ModalTitle";
import { SeeMoreParagraph } from "@/components/UI/molecules/SeeMoreParagraph";
import { getCoverImgSrc, toBytes32 } from "@/src/helpers/cover";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { CoverProfileInfo } from "@/components/common/CoverProfileInfo";
import { convertFromUnits, toBN } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { ProvideLiquidityForm } from "@/components/LiquidityForms/ProvideLiquidityForm";

export const MyLiquidityCoverPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = toBytes32(cover_id);
  const { coverInfo } = useCoverInfo(coverKey);

  const {
    info,
    refetch: refetchInfo,
    isWithdrawalWindowOpen,
    accrueInterest,
  } = useMyLiquidityInfo({
    coverKey,
  });

  function onClose() {
    setIsOpen(false);
  }

  function onOpen() {
    setIsOpen(true);
  }

  const imgSrc = getCoverImgSrc(coverInfo);

  const totalLiquidity = info.totalLiquidity;
  const myLiquidity = info.myUnrealizedShare;
  const myEarnings = toBN(info.myUnrealizedShare)
    .plus(info.liquidityRemovedByMe)
    .minus(info.liquidityAddedByMe);
  const reassuranceAmount = info.totalReassurance;

  if (!coverInfo) {
    return <>loading...</>;
  }

  return (
    <div>
      <main className="bg-f1f3f6">
        {/* hero */}
        <Hero>
          <Container className="px-2 py-20">
            <BreadCrumbs
              pages={[
                { name: "My Liquidity", href: "/my-liquidity", current: false },
                { name: coverInfo.projectName, href: "#", current: true },
              ]}
            />
            <div className="flex">
              <CoverProfileInfo
                coverKey={coverKey}
                projectName={coverInfo?.coverName}
                links={coverInfo?.links}
                imgSrc={imgSrc}
              />

              {/* My Liquidity */}
              <HeroStat title="My Liquidity">
                {formatCurrency(convertFromUnits(myLiquidity)).long}
              </HeroStat>
            </div>
          </Container>
        </Hero>

        {/* Content */}
        <div className="pt-12 pb-24 border-t border-t-B0C4DB">
          <Container className="grid grid-cols-3 gap-32">
            <div className="col-span-2">
              {/* Description */}
              <SeeMoreParagraph text={coverInfo.about}></SeeMoreParagraph>

              <div className="mt-12">
                <ProvideLiquidityForm coverKey={coverKey} info={info} />
              </div>
            </div>

            <div>
              <CoverPurchaseResolutionSources coverInfo={coverInfo}>
                <div
                  className="flex justify-between pt-4 pb-2"
                  title={formatCurrency(convertFromUnits(totalLiquidity)).long}
                >
                  <span className="">Total Liquidity:</span>
                  <strong className="font-bold text-right">
                    {formatCurrency(convertFromUnits(totalLiquidity)).short}
                  </strong>
                </div>
                <div
                  className="flex justify-between pb-2"
                  title={
                    formatCurrency(convertFromUnits(myEarnings.toString())).long
                  }
                >
                  <span className="">My Earnings:</span>
                  <strong className="font-bold text-right">
                    {
                      formatCurrency(
                        convertFromUnits(myEarnings.toString()),
                        "USD"
                      ).short
                    }
                  </strong>
                </div>
                <div
                  className="flex justify-between pb-8"
                  title={
                    formatCurrency(
                      convertFromUnits(reassuranceAmount).toString(),
                      "USD"
                    ).long
                  }
                >
                  <span className="">Reassurance:</span>
                  <strong className="font-bold text-right">
                    {
                      formatCurrency(
                        convertFromUnits(reassuranceAmount).toString(),
                        "USD"
                      ).short
                    }
                  </strong>
                </div>

                <div className="flex justify-center px-7">
                  <OutlinedButton
                    className="w-full rounded-big"
                    onClick={onOpen}
                  >
                    Withdraw Liquidity
                  </OutlinedButton>
                </div>
              </CoverPurchaseResolutionSources>
              <div className="flex justify-end">
                {isWithdrawalWindowOpen && (
                  <button
                    className="mt-4 mr-2 text-sm text-4e7dd9 hover:underline disabled:hover:no-underline"
                    onClick={accrueInterest}
                  >
                    Accrue
                  </button>
                )}
              </div>
            </div>
          </Container>
        </div>
      </main>

      <WithdrawLiquidityModal
        modalTitle={<ModalTitle imgSrc={imgSrc}>Withdraw Liquidity</ModalTitle>}
        onClose={onClose}
        isOpen={isOpen}
        info={info}
        refetchInfo={refetchInfo}
      />
    </div>
  );
};
