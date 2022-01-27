import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { Badge } from "@/components/UI/atoms/badge";
import { Divider } from "@/components/UI/atoms/divider";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { getCoverImgSrc, getParsedKey } from "@/src/helpers/cover";
import { convertFromUnits } from "@/utils/bn";
import { classNames } from "@/utils/classnames";
import { unixToDate } from "@/utils/date";
import Link from "next/link";
import { useActivePolicyStatus } from "@/src/hooks/useActivePolicyStatus";
import { IncidentReportStatus } from "@/components/common/IncidentReportStatus";

export const ActivePolicyCard = ({ details }) => {
  const { totalAmountToCover, expiresOn, cover } = details;
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
  const isClaimable = false;

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

      {/* Stats */}
      <div className="flex justify-between text-sm px-1 pb-4">
        {report ? (
          <Stat
            title="Resolution By"
            value={
              unixToDate(report.resolutionTimestamp, "YYYY/MM/DD HH:mm") +
              " UTC"
            }
          />
        ) : (
          <Stat
            title="Expires In"
            value={unixToDate(expiresOn, "YYYY/MM/DD HH:mm") + " UTC"}
          />
        )}

        <Stat
          title="Purchased Policy"
          value={`$ ${convertFromUnits(totalAmountToCover).toString()}`}
          right
        />
      </div>

      {isClaimable && (
        <Link href={`/my-policies/${getParsedKey(key)}/claim`}>
          <a className="flex justify-center py-2.5 w-full bg-4e7dd9 text-white text-sm font-semibold rounded-lg mt-2 mb-4">
            CLAIM
          </a>
        </Link>
      )}
    </OutlinedCard>
  );
};

const Stat = ({ title, value, right, variant }) => {
  return (
    <div className="flex flex-col">
      <span className="font-semibold text-black text-sm pb-2">{title}</span>
      <span
        className={classNames(
          variant === "error" ? "text-FA5C2F" : "text-7398C0",
          right && "text-right"
        )}
      >
        {value}
      </span>
    </div>
  );
};
