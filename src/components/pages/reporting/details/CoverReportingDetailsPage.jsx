import { CoverRules } from "@/components/common/CoverRules";
import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { Container } from "@/components/UI/atoms/container";
import { AcceptReportRulesForm } from "@/components/UI/organisms/accept-cover-rules-form";
import { CoverPurchaseResolutionSources } from "@/components/UI/organisms/cover/purchase/resolution-sources";
import { ReportingHero } from "@/components/UI/organisms/reporting/new/ReportingHero";
import Link from "next/link";
import { useRouter } from "next/router";

export const CoverReportingDetailsPage = () => {
  const router = useRouter();
  const { cover_id } = router.query;
  const { coverInfo } = useCoverInfo(cover_id);

  if (!coverInfo) {
    return <>loading...</>;
  }

  const title = coverInfo.coverName;

  const handleAcceptRules = () => {
    router.push(`/reporting/${cover_id}/new`);
  };

  return (
    <main>
      {/* hero */}
      <ReportingHero coverInfo={coverInfo} />

      {/* Content */}
      <div className="pt-12 pb-24 border-t border-t-B0C4DB">
        <Container className="grid gap-32 grid-cols-3">
          <div className="col-span-2">
            {/* Rules */}
            <CoverRules rules={coverInfo?.rules} />

            <br className="mt-20" />

            <div className="mt-16">
              <AcceptReportRulesForm onAccept={handleAcceptRules}>
                I have read, understood, and agree to the terms of cover rules
              </AcceptReportRulesForm>
            </div>
          </div>
          <CoverPurchaseResolutionSources
            projectName={title}
            knowledgebase={coverInfo?.resolutionSources[1]}
            twitter={coverInfo?.resolutionSources[0]}
          >
            <Link href="#">
              <a className="block text-4e7dd9 hover:underline mt-3">
                Neptune Mutual Reporters
              </a>
            </Link>
          </CoverPurchaseResolutionSources>
        </Container>
      </div>
    </main>
  );
};
