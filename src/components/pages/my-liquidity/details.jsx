import { useState } from "react";
import { useRouter } from "next/router";
import { Container } from "@/components/UI/atoms/container";
import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { BreadCrumbs } from "@/components/UI/atoms/breadcrumbs";
import { Hero } from "@/components/UI/molecules/Hero";
import { HeroStat } from "@/components/UI/molecules/HeroStat";
import { CoverPurchaseResolutionSources } from "@/components/UI/organisms/cover/purchase/resolution-sources";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { WithdrawLiquidityModal } from "@/components/UI/organisms/cover-form/my-liquidity/WithdrawLiquidityModal";
import { ModalTitle } from "@/components/UI/molecules/modal/ModalTitle";
import { SeeMoreParagraph } from "@/components/UI/molecules/SeeMoreParagraph";
import { getCoverImgSrc, toBytes32 } from "@/src/helpers/cover";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { MyLiquidityForm } from "@/components/UI/organisms/cover-form/my-liquidity/MyLiquidityForm";
import { CoverProfileInfo } from "@/components/common/CoverProfileInfo";
import { liquidityTokenSymbol } from "@/src/config/constants";
import BigNumber from "bignumber.js";
import { convertFromUnits, sumOf } from "@/utils/bn";
import { formatAmount, formatWithAabbreviation } from "@/utils/formatter";

export const MyLiquidityCoverPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = toBytes32(cover_id);
  const { coverInfo } = useCoverInfo(coverKey);
  const { info } = useMyLiquidityInfo({ coverKey });

  if (!coverInfo) {
    return <>loading...</>;
  }

  function onClose() {
    setIsOpen(false);
  }

  function onOpen() {
    setIsOpen(true);
  }

  const imgSrc = getCoverImgSrc(coverInfo);

  const totalLiquidity = sumOf(info.balance, info.extendedBalance);
  const myLiquidity = BigNumber(info.myShare);
  const myEarnings = myLiquidity.minus(
    BigNumber(info.myDeposits).minus(BigNumber(info.myWithdrawals))
  );
  const reassuranceAmount = info.totalReassurance;

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
                projectName={coverInfo?.coverName}
                links={coverInfo?.links}
                imgSrc={imgSrc}
              />

              {/* Total Liquidity */}
              <HeroStat title="My Liquidity">
                <>
                  {formatAmount(convertFromUnits(myLiquidity).toString())}{" "}
                  {liquidityTokenSymbol}
                </>
              </HeroStat>
            </div>
          </Container>
        </Hero>

        {/* Content */}
        <div className="pt-12 pb-24 border-t border-t-B0C4DB">
          <Container className="grid gap-32 grid-cols-3">
            <div className="col-span-2">
              {/* Description */}
              <SeeMoreParagraph text={coverInfo.about}></SeeMoreParagraph>

              <div className="mt-12">
                <MyLiquidityForm coverKey={coverKey} info={info} />
              </div>
            </div>

            <CoverPurchaseResolutionSources coverInfo={coverInfo}>
              <div className="flex justify-between pt-4 pb-2">
                <span className="">Total Liquidity:</span>
                <strong className="text-right font-bold">
                  ${" "}
                  {formatWithAabbreviation(
                    convertFromUnits(totalLiquidity).toString()
                  )}
                </strong>
              </div>
              <div className="flex justify-between pb-2">
                <span className="">My Earnings:</span>
                <strong className="text-right font-bold">
                  ${" "}
                  {formatWithAabbreviation(
                    convertFromUnits(myEarnings).toString()
                  )}
                </strong>
              </div>
              <div className="flex justify-between pb-8">
                <span className="">Reassurance:</span>
                <strong className="text-right font-bold">
                  ${" "}
                  {formatWithAabbreviation(
                    convertFromUnits(reassuranceAmount).toString()
                  )}
                </strong>
              </div>

              <div className="flex justify-center px-7">
                <OutlinedButton className="rounded-big w-full" onClick={onOpen}>
                  Withdraw Liquidity
                </OutlinedButton>
              </div>
            </CoverPurchaseResolutionSources>
          </Container>
        </div>
      </main>

      <WithdrawLiquidityModal
        id={"1234"}
        modalTitle={<ModalTitle imgSrc={imgSrc}>Withdraw Liquidity</ModalTitle>}
        onClose={onClose}
        isOpen={isOpen}
      />
    </div>
  );
};
