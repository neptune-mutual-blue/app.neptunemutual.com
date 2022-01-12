import { AcceptRulesForm } from "@/components/UI/organisms/accept-rules-form";
import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { useRouter } from "next/router";

import { CoverAddLiquidityDetailsPage as DetailsPage } from "@/components/UI/organisms/cover/add-liquidity/details";

export const CoverAddLiquidityDetailsPage = () => {
  const { query, push } = useRouter();
  const { cover_id } = query;

  const handleAcceptRules = () => {
    push(`/cover/${cover_id}/add-liquidity/checkout`);
  };

  const { coverInfo } = useCoverInfo();

  if (!coverInfo) {
    return <>loading...</>;
  }

  return (
    <div>
      <DetailsPage>
        <>
          {/* Rules */}
          <div>
            <h4 className="text-h4 font-sora font-semibold mt-10 mb-6">
              Cover Rules
            </h4>
            <p className="mb-4">
              Carefully read the following terms and conditions. For a
              successful claim payout, all of the following points must be true.
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
        </>
      </DetailsPage>
    </div>
  );
};
