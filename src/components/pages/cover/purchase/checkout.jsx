import { Container } from "@/components/UI/atoms/container";
import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { CoverHero } from "@/components/UI/organisms/cover/hero";
import { CoverForm } from "@/components/UI/organisms/cover-form";
import { CoverActionsFooter } from "@/components/UI/organisms/cover/actions-footer";
import { CoverPurchaseResolutionSources } from "@/components/UI/organisms/cover/purchase/resolution-sources";
import { useRouter } from "next/router";

export const CoverPurchaseCheckoutPage = () => {
  const router = useRouter();
  const { cover_id } = router.query;
  const { coverInfo } = useCoverInfo(cover_id);

  if (!coverInfo) {
    return <>loading...</>;
  }

  const imgSrc = "/images/covers/clearpool.png";
  const reassuranceToken = coverInfo.reassuranceToken;

  return (
    <main>
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

            <br className="mt-20" />

            <div className="mt-12">
              <CoverForm
                coverKey={cover_id}
                assuranceTokenAddress={reassuranceToken.at}
                assuranceTokenSymbol={reassuranceToken.symbol}
              />
            </div>
          </div>

          <CoverPurchaseResolutionSources
            projectName={coverInfo.projectName}
            knowledgebase={coverInfo?.resolutionSources[1]}
            twitter={coverInfo?.resolutionSources[0]}
          />
        </Container>
      </div>

      <CoverActionsFooter activeKey="purchase" />
    </main>
  );
};
