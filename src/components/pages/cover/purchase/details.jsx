import { Container } from "@/components/UI/atoms/container";
import { AcceptRulesForm } from "@/components/UI/organisms/accept-rules-form";
import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { CoverHero } from "@/components/UI/organisms/cover/hero";
import { useRouter } from "next/router";
import { CoverActionsFooter } from "@/components/UI/organisms/cover/actions-footer";
import { CoverPurchaseResolutionSources } from "@/components/UI/organisms/cover/purchase/resolution-sources";

export const CoverPurchaseDetailsPage = () => {
  const router = useRouter();
  const { cover_id } = router.query;

  const { coverInfo } = useCoverInfo(cover_id);

  if (!coverInfo) {
    return <>loading...</>;
  }

  const imgSrc = `/images/covers/${coverInfo?.key}.png`;
  const title = coverInfo.coverName;

  const handleAcceptRules = () => {
    router.push(`/cover/${cover_id}/purchase/checkout`);
  };

  return (
    <main>
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

          <CoverPurchaseResolutionSources
            covername={title}
            knowledgebase={coverInfo?.resolutionSources[1]}
            twitter={coverInfo?.resolutionSources[0]}
          />
        </Container>
      </div>

      <CoverActionsFooter activeKey="purchase" />
    </main>
  );
};
