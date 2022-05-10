import { useState } from "react";
import { useRouter } from "next/router";
import { Container } from "@/common/Container/Container";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { BreadCrumbs } from "@/common/BreadCrumbs/BreadCrumbs";
import { Hero } from "@/common/Hero";
import { HeroStat } from "@/common/HeroStat";
import { CoverPurchaseResolutionSources } from "@/common/Cover/Purchase/CoverPurchaseResolutionSources";
import { OutlinedButton } from "@/common/Button/OutlinedButton";
import { WithdrawLiquidityModal } from "@/src/modules/my-liquidity/WithdrawLiquidityModal";
import { ModalTitle } from "@/common/Modal/ModalTitle";
import { SeeMoreParagraph } from "@/common/SeeMoreParagraph";
import { getCoverImgSrc, safeFormatBytes32String } from "@/src/helpers/cover";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { CoverProfileInfo } from "@/common/CoverProfileInfo/CoverProfileInfo";
import { convertFromUnits, isGreater } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { ProvideLiquidityForm } from "@/common/LiquidityForms/ProvideLiquidityForm";
import { useLiquidityFormsContext } from "@/common/LiquidityForms/LiquidityFormsContext";
import { t, Trans } from "@lingui/macro";

export const MyLiquidityCoverPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);
  const { coverInfo } = useCoverInfo(coverKey);

  const {
    info,
    refetch: refetchInfo,
    isWithdrawalWindowOpen,
    accrueInterest,
  } = useMyLiquidityInfo({
    coverKey,
  });

  const { myStake, podBalance } = useLiquidityFormsContext();

  function onClose() {
    setIsOpen(false);
  }

  function onOpen() {
    setIsOpen(true);
  }

  const imgSrc = getCoverImgSrc(coverInfo);

  const totalLiquidity = info.totalLiquidity;
  const myLiquidity = info.myUnrealizedShare;
  const reassuranceAmount = info.totalReassurance;

  if (!coverInfo) {
    return (
      <>
        <Trans>loading...</Trans>
      </>
    );
  }

  return (
    <div>
      <main className="bg-f1f3f6">
        {/* hero */}
        <Hero>
          <Container className="px-2 py-20">
            <BreadCrumbs
              pages={[
                {
                  name: t`My Liquidity`,
                  href: "/my-liquidity",
                  current: false,
                },
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
              <HeroStat title={t`My Liquidity`}>
                {
                  formatCurrency(convertFromUnits(myLiquidity), router.locale)
                    .long
                }
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
                  title={
                    formatCurrency(
                      convertFromUnits(totalLiquidity),
                      router.locale
                    ).long
                  }
                >
                  <span className="">
                    <Trans>Total Liquidity:</Trans>
                  </span>
                  <strong className="font-bold text-right">
                    {
                      formatCurrency(
                        convertFromUnits(totalLiquidity),
                        router.locale
                      ).short
                    }
                  </strong>
                </div>
                <div
                  className="flex justify-between pb-8"
                  title={
                    formatCurrency(
                      convertFromUnits(reassuranceAmount).toString(),
                      router.locale,
                      "USD"
                    ).long
                  }
                >
                  <span className="">Reassurance:</span>
                  <strong className="font-bold text-right">
                    {
                      formatCurrency(
                        convertFromUnits(reassuranceAmount).toString(),
                        router.locale,
                        "USD"
                      ).short
                    }
                  </strong>
                </div>

                {isGreater(myStake, "0") && isGreater(podBalance, "0") && (
                  <div className="flex justify-center px-7">
                    <OutlinedButton
                      className="w-full rounded-big"
                      onClick={onOpen}
                    >
                      <Trans>Withdraw Liquidity</Trans>
                    </OutlinedButton>
                  </div>
                )}
              </CoverPurchaseResolutionSources>
              <div className="flex justify-end">
                {isWithdrawalWindowOpen && (
                  <button
                    className="mt-4 mr-2 text-sm text-4e7dd9 hover:underline disabled:hover:no-underline"
                    onClick={accrueInterest}
                  >
                    <Trans>Accrue</Trans>
                  </button>
                )}
              </div>
            </div>
          </Container>
        </div>
      </main>

      <WithdrawLiquidityModal
        modalTitle={
          <ModalTitle imgSrc={imgSrc}>
            <Trans>Withdraw Liquidity</Trans>
          </ModalTitle>
        }
        onClose={onClose}
        isOpen={isOpen}
        info={info}
        refetchInfo={refetchInfo}
      />
    </div>
  );
};
