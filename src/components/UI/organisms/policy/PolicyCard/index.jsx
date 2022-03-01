import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { Badge } from "@/components/UI/atoms/badge";
import { Divider } from "@/components/UI/atoms/divider";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { classNames } from "@/utils/classnames";
import { IncidentReportStatus } from "@/components/common/IncidentReportStatus";
import { PolicyCardFooter } from "@/components/UI/organisms/policy/PolicyCard/PolicyCardFooter";
import { useValidReport } from "@/src/hooks/useValidReport";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";

export const PolicyCard = ({ policyInfo }) => {
  const { cover, cxToken } = policyInfo;

  const coverKey = cover.id;
  const { coverInfo } = useCoverInfo(coverKey);

  const validityStartsAt = cxToken.creationDate || "0";
  const validityEndsAt = cxToken.expiryDate || "0";
  const {
    data: { report },
  } = useValidReport({
    start: validityStartsAt,
    end: validityEndsAt,
    coverKey,
  });
  const { balance } = useERC20Balance(cxToken.id);

  const imgSrc = getCoverImgSrc({ key: coverKey });

  const status = report?.status || null;
  const statusType = ["Reporting", "FalseReporting"].includes(status)
    ? "failure"
    : "";

  return (
    <div className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9">
      <OutlinedCard className="bg-white p-6" type="normal">
        <div>
          <div className="flex justify-between">
            <div className="w-18 h-18 bg-DEEAF6 p-3 rounded-full">
              <img
                src={imgSrc}
                alt={coverInfo.projectName}
                className="inline-block max-w-full"
              />
            </div>

            <div>
              {status && (
                <Badge
                  className={classNames(
                    statusType == "failure" ? " text-FA5C2F" : "text-21AD8C"
                  )}
                >
                  <IncidentReportStatus status={status} />
                </Badge>
              )}
            </div>
          </div>
          <h4 className="text-h4 font-sora font-semibold uppercase mt-4">
            {coverInfo.projectName}
          </h4>
        </div>

        {/* Divider */}
        <Divider />

        <PolicyCardFooter
          coverKey={coverKey}
          report={report}
          tokenBalance={balance}
          validityEndsAt={validityEndsAt}
        />
      </OutlinedCard>
    </div>
  );
};
