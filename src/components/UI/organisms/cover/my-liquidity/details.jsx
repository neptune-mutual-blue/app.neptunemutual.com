import { useState } from "react";
import { Container } from "@/components/UI/atoms/container";
import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { CoverHero } from "@/components/UI/organisms/cover/my-liquidity/hero";
import { CoverPurchaseResolutionSources } from "@/components/UI/organisms/cover/purchase/resolution-sources";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { WithdrawLiquidityModal } from "@/components/UI/organisms/cover-form/my-liquidity/modal-form";
import { ModalTitle } from "@/components/UI/molecules/pools/staking/modal-title";

export const MyLiquidityDetailsPage = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { coverInfo } = useCoverInfo();

  if (!coverInfo) {
    return <>loading...</>;
  }

  const imgSrc = "/covers/clearpool.png";
  const title = coverInfo.name;

  function onClose() {
    setIsOpen(false);
  }

  function onOpen() {
    setIsOpen(true);
  }

  return (
    <div>
      <main className="bg-F1F3F6">
        {/* hero */}
        <CoverHero coverInfo={coverInfo} title={title} imgSrc={imgSrc} />

        {/* Content */}
        <div className="pt-12 pb-24 border-t border-t-B0C4DB">
          <Container className="grid gap-32 grid-cols-3">
            <div className="col-span-2">
              {/* Description */}
              <p>{coverInfo.about}</p>

              {/* Read more */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-40 hover:underline mt-4"
              >
                See More
              </a>

              {children}
            </div>

            <CoverPurchaseResolutionSources>
              <hr className="mt-4 mb-6 border-t border-B0C4DB/60" />
              <div className="flex justify-between pb-2">
                <span className="">Total Liquidity:</span>
                <strong className="text-right font-bold">$ 2.5M</strong>
              </div>
              <div className="flex justify-between pb-2">
                <span className="">My Earningas:</span>
                <strong className="text-right font-bold">$ 750k</strong>
              </div>
              <div className="flex justify-between pb-8">
                <span className="">Reassurance:</span>
                <strong className="text-right font-bold">$ 750k</strong>
              </div>

              <div className="flex justify-center px-7">
                <OutlinedButton
                  className="rounded-big w-full"
                  onClick={() => onOpen()}
                >
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
