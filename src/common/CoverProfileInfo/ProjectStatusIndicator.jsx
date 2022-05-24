import StatusClaimableIcon from "@/icons/StatusClaimableIcon";
import StatusFalseReportingIcon from "@/icons/StatusFalseReportingIcon";
import StatusIncidentOccurredIcon from "@/icons/StatusIncidentOccurredIcon";
import StatusNormalIcon from "@/icons/StatusNormalIcon";
import StatusStoppedIcon from "@/icons/StatusStoppedIcon";
import { isGreater } from "@/utils/bn";
import { classNames } from "@/utils/classnames";
import Link from "next/link";
import { renderStatusIndicatorTranslation } from "@/utils/translations";
import { safeParseBytes32String } from "@/utils/formatter/bytes32String";

// Status => Variant
const variants = {
  "Stopped": "gray",
  "Normal": "green",
  "Claimable": "blue",
  "Incident Happened": "red",
  "False Reporting": "green",
};

// Status => Icon
const icons = {
  "Stopped": StatusStoppedIcon,
  "Normal": StatusNormalIcon,
  "Claimable": StatusClaimableIcon,
  "Incident Happened": StatusIncidentOccurredIcon,
  "False Reporting": StatusFalseReportingIcon,
};

export const ProjectStatusIndicator = ({ coverKey, status, incidentDate }) => {
  const variant = variants[status] || "green";
  const Icon = icons[status] || StatusNormalIcon;

  if (!status) {
    return null;
  }

  const badge = (
    <div
      className={classNames(
        "ml-4 flex items-center rounded-1 py-0.5 px-1.5 text-xs leading-4.5 text-white",
        variant === "blue" && "bg-4289F2",
        variant === "gray" && "bg-9B9B9B",
        variant === "green" && "bg-21AD8C",
        variant === "red" && "bg-FA5C2F"
      )}
      data-testid="projectstatusindicator-container"
    >
      <Icon width="14" height="14" />{" "}
      <div className="ml-1">{renderStatusIndicatorTranslation(status)}</div>
    </div>
  );

  if (isGreater(incidentDate, "0")) {
    return (
      <Link
        href={`/reporting/${safeParseBytes32String(
          coverKey
        )}/${incidentDate}/details`}
      >
        <a data-testid="badge-link">{badge}</a>
      </Link>
    );
  }

  return badge;
};
