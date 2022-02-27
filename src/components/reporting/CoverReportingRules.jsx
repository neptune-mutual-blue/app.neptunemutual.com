import { CoverRules } from "@/components/common/CoverRules";
import { ReportingInfo } from "@/components/reporting/ReportingInfo";
import { Alert } from "@/components/UI/atoms/alert";
import { Container } from "@/components/UI/atoms/container";
import { AcceptReportRulesForm } from "@/components/UI/organisms/accept-cover-rules-form";
import { CoverPurchaseResolutionSources } from "@/components/UI/organisms/cover/purchase/resolution-sources";
import { useReporterCommission } from "@/src/hooks/useReporterCommission";
import Link from "next/link";

export const CoverReportingRules = ({
  coverInfo,
  handleAcceptRules,
  activeReportings,
}) => {
  const { commission } = useReporterCommission();
  const hasActiveReportings = activeReportings && activeReportings.length > 0;

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
              <AcceptReportRulesForm onAccept={handleAcceptRules}>
                <div className="mt-16">
                  <h2 className="font-sora font-bold text-h2 mb-6">
                    Active Reporting
                  </h2>

                  {!hasActiveReportings && (
                    <p className="text-h4 text-8F949C mb-10">
                      There are no known incidents related to{" "}
                      {coverInfo.projectName} Cover.
                    </p>
                  )}

                  {hasActiveReportings && (
                    <div className="mb-10">
                      {activeReportings.map((x) => {
                        return (
                          <ReportingInfo
                            key={x.id}
                            ipfsBytes={x.reporterInfo}
                          />
                        );
                      })}
                    </div>
                  )}

                  <Alert>
                    If you just came to know about a recent incident of{" "}
                    {coverInfo.projectName}, carefully read the cover rules
                    above. You can earn {commission}% of the minority fees if
                    you are the first person to report this incident.
                  </Alert>
                </div>
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
