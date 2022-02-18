import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { Badge } from "@/components/UI/atoms/badge";
import { Divider } from "@/components/UI/atoms/divider";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { classNames } from "@/utils/classnames";
import { useActivePolicyStatus } from "@/src/hooks/useActivePolicyStatus";
import { IncidentReportStatus } from "@/components/common/IncidentReportStatus";
import { PolicyCardFooter } from "@/components/UI/organisms/policy/ActivePolicyCard/PolicyCardFooter";

export const ActivePolicyCard = ({ policyInfo }) => {
  const { expiresOn, cover } = policyInfo;
  // const { totalAmountToCover, expiresOn, cover, cxToken } = policyInfo;
  const { coverInfo } = useCoverInfo(cover.id);
  const {
    data: { statuses, reports },
  } = useActivePolicyStatus({
    coverKey: cover.id,
    expiresOn,
  });

  const imgSrc = getCoverImgSrc({ key: cover.id });

  const status = statuses[0];
  const report = reports[0];
  const statusType = ["Reporting", "FalseReporting"].includes(status)
    ? "failure"
    : "";

  return (
    <OutlinedCard className="bg-white p-6" type="normal">
      <div className="flex justify-between">
        <div>
          <div className="w-18 h-18 bg-DEEAF6 p-3 rounded-full">
            <img
              src={imgSrc}
              alt={coverInfo.projectName}
              className="inline-block max-w-full"
            />
          </div>
          <h4 className="text-h4 font-sora font-semibold uppercase mt-4">
            {coverInfo.projectName}
          </h4>
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

      {/* Divider */}
      <Divider />

      <PolicyCardFooter policyInfo={policyInfo} {...{ status, report }} />
    </OutlinedCard>
  );
};
