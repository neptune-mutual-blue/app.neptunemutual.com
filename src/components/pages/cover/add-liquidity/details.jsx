import { AcceptRulesForm } from "@/components/UI/organisms/accept-rules-form";
import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { useRouter } from "next/router";

import { CoverAddLiquidityDetailsPage as DetailsPage } from "@/components/UI/organisms/cover/add-liquidity/details";
import { CoverRules } from "@/components/common/CoverRules";

export const CoverAddLiquidityDetailsPage = () => {
  const { query, push } = useRouter();
  const { cover_id } = query;

  const handleAcceptRules = () => {
    push(`/cover/${cover_id}/add-liquidity/checkout`);
  };

  const { coverInfo } = useCoverInfo(cover_id);

  if (!coverInfo) {
    return <>loading...</>;
  }

  return (
    <div>
      <DetailsPage>
        <>
          <CoverRules rules={coverInfo?.rules} />

          <br className="mt-20" />

          <AcceptRulesForm onAccept={handleAcceptRules}>
            I have read, understood, and agree to the terms of cover rules
          </AcceptRulesForm>
        </>
      </DetailsPage>
    </div>
  );
};
