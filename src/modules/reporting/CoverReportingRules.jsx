import { CoverRules } from "@/common/CoverRules/CoverRules";
import { ReportingInfo } from "./ReportingInfo";
import { Alert } from "@/common/Alert/Alert";
import { Container } from "@/common/Container/Container";
import { AcceptReportRulesForm } from "@/common/AcceptCoverRulesForm/AcceptReportRulesForm";
import { CoverResolutionSources } from "@/common/Cover/CoverResolutionSources";
import { useReporterCommission } from "@/src/hooks/useReporterCommission";
import Link from "next/link";
import { Trans } from "@lingui/macro";

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
        <Container className="grid grid-cols-3 md:gap-32">
          <div className="col-span-3 row-start-3 md:col-span-2 md:row-start-auto">
            {/* Rules */}
            <CoverRules rules={coverInfo?.infoObj.rules} />
            <div>
              <AcceptReportRulesForm onAccept={handleAcceptRules}>
                <div className="mt-16">
                  <h2 className="mb-6 font-bold font-sora text-h2">
                    <Trans>Active Reporting</Trans>
                  </h2>

                  {!hasActiveReportings && (
                    <p className="mb-10 text-h4 text-8F949C">
                      <Trans>
                        There are no known incidents of {coverInfo.coverName}.
                      </Trans>
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
                    <Trans>
                      If you just came to know about a recent incident of{" "}
                      {coverInfo.projectName}, carefully read the cover rules
                      above. You can earn flat {commission}% of total dishonest
                      stakes if you are the first person to report this
                      incident. In addition to NPM rewards, you may also earn a
                      percentage commission on individual claims payout.
                      <br />
                      <br />
                      <span>
                        Note: Dishonest reporters get 100% of their stakes
                        forfeited which is distributed to honest reporters. You
                        may lose all of your stakes if resolution is not in your
                        favor.
                      </span>
                    </Trans>
                  </Alert>
                </div>
              </AcceptReportRulesForm>
            </div>
          </div>
          <CoverResolutionSources coverInfo={coverInfo}>
            <Link href="#">
              <a className="block mt-3 text-4e7dd9 hover:underline">
                <Trans>Neptune Mutual Reporters</Trans>
              </a>
            </Link>
          </CoverResolutionSources>
        </Container>
      </div>
    </>
  );
};
