import { Divider } from "@/components/UI/atoms/divider";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { Badge } from "@/components/UI/atoms/badge";
import { classNames } from "@/utils/classnames";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { IncidentReportStatus } from "@/components/common/IncidentReportStatus";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";

export const ResolvedReportingCard = ({ coverKey, status, resolvedOn }) => {
  const { coverInfo } = useCoverInfo(coverKey);
  const imgSrc = getCoverImgSrc({ key: coverKey });
  const statusType = ["Reporting", "FalseReporting"].includes(status)
    ? "failure"
    : "";

  return (
    <OutlinedCard className="bg-white p-6" type="link">
      <div className="flex justify-between">
        <div>
          <div className="w-18 h-18 bg-DEEAF6 rounded-full">
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
          <Badge
            className={classNames(
              statusType == "failure" ? "text-FA5C2F" : "text-21AD8C"
            )}
          >
            <IncidentReportStatus status={status} />
          </Badge>
        </div>
      </div>

      {/* Divider */}
      <Divider />

      {/* Stats */}
      <div className="flex justify-between text-sm px-1 mb-4">
        <span className="" title={DateLib.toLongDateFormat(resolvedOn)}>
          Resolved On:{" "}
          <span title={DateLib.toLongDateFormat(resolvedOn)}>
            {fromNow(resolvedOn)}
          </span>
        </span>
      </div>
    </OutlinedCard>
  );
};
