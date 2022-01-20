import { useState } from "react";
import { Container } from "@/components/UI/atoms/container";
import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { CoverHero } from "@/components/UI/organisms/cover/my-liquidity/hero";
import { CoverPurchaseResolutionSources } from "@/components/UI/organisms/cover/purchase/resolution-sources";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { WithdrawLiquidityModal } from "@/components/UI/organisms/cover-form/my-liquidity/WithdrawLiquidityModal";
import { ModalTitle } from "@/components/UI/molecules/pools/staking/modal-title";
import { useRouter } from "next/router";
import SeeMoreParagraph from "@/components/UI/molecules/see-more-paragraph";
import { getCoverImgSrc } from "@/src/helpers/cover";

export const MyLiquidityDetailsPage = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const { cover_id } = router.query;
  const { coverInfo } = useCoverInfo(cover_id);

  if (!coverInfo) {
    return <>loading...</>;
  }

  const imgSrc = getCoverImgSrc(coverInfo);

  function onClose() {
    setIsOpen(false);
  }

  function onOpen() {
    setIsOpen(true);
  }

  return (
    <div>
      <main className="bg-f1f3f6">
        {/* hero */}
        <CoverHero
          coverInfo={coverInfo}
          title={coverInfo.coverName}
          imgSrc={imgSrc}
        />

        {/* Content */}
        <div className="pt-12 pb-24 border-t border-t-B0C4DB">
          <Container className="grid gap-32 grid-cols-3">
            <div className="col-span-2">
              {/* Description */}
              <SeeMoreParagraph>{coverInfo.about}</SeeMoreParagraph>

              {children}
            </div>

            <CoverPurchaseResolutionSources
              projectName={coverInfo.projectName}
              knowledgebase={coverInfo?.resolutionSources[1]}
              twitter={coverInfo?.resolutionSources[0]}
            >
              <div className="flex justify-between pt-4 pb-2">
                <span className="">Total Liquidity:</span>
                <strong className="text-right font-bold">$ 2.5M</strong>
              </div>
              <div className="flex justify-between pb-2">
                <span className="">My Earnings:</span>
                <strong className="text-right font-bold">$ 750k</strong>
              </div>
              <div className="flex justify-between pb-8">
                <span className="">Reassurance:</span>
                <strong className="text-right font-bold">$ 750k</strong>
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
        unitName={" POD"}
      />
    </div>
  );
};
