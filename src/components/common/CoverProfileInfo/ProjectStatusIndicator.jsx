import StatusClaimableIcon from "@/icons/StatusClaimableIcon";
import StatusFalseReportingIcon from "@/icons/StatusFalseReportingIcon";
import StatusIncidentOccurredIcon from "@/icons/StatusIncidentOccurredIcon";
import StatusNormalIcon from "@/icons/StatusNormalIcon";
import StatusStoppedIcon from "@/icons/StatusStoppedIcon";
import { classNames } from "@/utils/classnames";

// Status => Variant
const variants = {
  "Stopped": "gray",
  "Normal": "green",
  "Claimable": "blue",
  "Incident Happened": "green",
  "False Reporting": "red",
};

// Status => Icon
const icons = {
  "Stopped": StatusStoppedIcon,
  "Normal": StatusNormalIcon,
  "Claimable": StatusClaimableIcon,
  "Incident Happened": StatusIncidentOccurredIcon,
  "False Reporting": StatusFalseReportingIcon,
};

export const ProjectStatusIndicator = ({ status }) => {
  const variant = variants[status] || "green";
  const Icon = icons[status] || StatusNormalIcon;

  if (!status) {
    return null;
  }

  return (
    <div
      className={classNames(
        "ml-4 flex items-center rounded-1 py-0.5 px-1.5 text-xs leading-4.5 text-white",
        variant === "blue" && "bg-4289F2",
        variant === "gray" && "bg-9B9B9B",
        variant === "green" && "bg-21AD8C",
        variant === "red" && "bg-FA5C2F"
      )}
    >
      <Icon width="14" height="14" /> <div className="ml-1">{status}</div>
    </div>
  );
};
