import { Container } from "@/components/UI/atoms/container";
import { AcceptRulesForm } from "@/components/UI/organisms/accept-rules-form";
import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { CoverHero } from "@/components/UI/organisms/cover/hero";
import { useRouter } from "next/router";
import { CoverActionsFooter } from "@/components/UI/organisms/cover/actions-footer";
import { CoverPurchaseResolutionSources } from "@/components/UI/organisms/cover/purchase/resolution-sources";

export const CoverAddLiquidityDetailsPage = () => {
  const router = useRouter();
  const { cover_id } = router.query;

  const handleAcceptRules = () => {
    router.push(`/cover/${cover_id}/add-liquidity/checkout`);
  };

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
        <CoverHero
          coverInfo={coverInfo}
          title={title}
          imgSrc={imgSrc}
          pageName="Provide Liquidity"
          hasTotalLiquidity={false}
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

              {/* Rules */}
              <div>
                <h4 className="text-h4 font-sora font-semibold mt-10 mb-6">
                  Cover Rules
                </h4>
                <p className="mb-4">
                  Carefully read the following terms and conditions. For a
                  successful claim payout, all of the following points must be
                  true.
                </p>
                <ol className="list-decimal pl-5">
                  {coverInfo.rules.split("\n").map((x, i) => (
                    <li key={i}>
                      {x
                        .trim()
                        .replace(/^\d+\./g, "")
                        .trim()}
                    </li>
                  ))}
                </ol>
              </div>

              <br className="mt-20" />

              <AcceptRulesForm onAccept={handleAcceptRules}>
                I have read, understood, and agree to the terms of cover rules
              </AcceptRulesForm>
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
