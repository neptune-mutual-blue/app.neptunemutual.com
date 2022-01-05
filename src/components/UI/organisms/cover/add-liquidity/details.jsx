import { Container } from "@/components/UI/atoms/container";
import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { CoverHero } from "@/components/UI/organisms/cover/add-liquidity/hero";
import { CoverActionsFooter } from "@/components/UI/organisms/cover/actions-footer";
import { CoverPurchaseResolutionSources } from "@/components/UI/organisms/cover/purchase/resolution-sources";

export const CoverAddLiquidityDetailsPage = ({ children }) => {
  const { coverInfo } = useCoverInfo();

  if (!coverInfo) {
    return <>loading...</>;
  }

  const imgSrc = "/covers/clearpool.png";
  const title = coverInfo.coverName;

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
              <div className="flex justify-between pb-2">
                <span className="">Total Liquidity::</span>
                <strong className="text-right font-bold">$ 2.5M</strong>
              </div>
              <div className="flex justify-between">
                <span className="">Reassurance:</span>
                <strong className="text-right font-bold">$ 750k</strong>
              </div>
            </CoverPurchaseResolutionSources>
          </Container>
        </div>

        <CoverActionsFooter activeKey="add-liquidity" />
      </main>
    </div>
  );
};
