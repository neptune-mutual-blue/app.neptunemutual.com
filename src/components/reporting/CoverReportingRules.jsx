import { CoverRules } from "@/components/common/CoverRules";
import { Container } from "@/components/UI/atoms/container";
import { AcceptReportRulesForm } from "@/components/UI/organisms/accept-cover-rules-form";
import { CoverPurchaseResolutionSources } from "@/components/UI/organisms/cover/purchase/resolution-sources";
import Link from "next/link";

export const CoverReportingRules = ({ coverInfo, handleAcceptRules }) => {
  return (
    <>
      {/* Content */}
      <div className="pt-12 pb-24 border-t border-t-B0C4DB">
        <Container className="grid gap-32 grid-cols-3">
          <div className="col-span-2">
            {/* Rules */}
            <CoverRules rules={coverInfo?.rules} />

            <br className="mt-20" />

            <div className="mt-16">
              <AcceptReportRulesForm
                coverInfo={coverInfo}
                onAccept={handleAcceptRules}
              >
                I have read, understood, and agree to the terms of cover rules
              </AcceptReportRulesForm>
            </div>
          </div>
          <CoverPurchaseResolutionSources coverInfo={coverInfo}>
            <Link href="#">
              <a className="block text-4e7dd9 hover:underline mt-3">
                Neptune Mutual Reporters
              </a>
            </Link>
          </CoverPurchaseResolutionSources>
        </Container>
      </div>
    </>
  );
};
