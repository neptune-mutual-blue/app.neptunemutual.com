import { classNames } from "@/utils/classnames";
import StatusClaimableIcon from "@/icons/StatusClaimableIcon";
import StatusFalseReportingIcon from "@/icons/StatusFalseReportingIcon";
import StatusIncidentOccurredIcon from "@/icons/StatusIncidentOccurredIcon";
import StatusNormalIcon from "@/icons/StatusNormalIcon";
import StatusStoppedIcon from "@/icons/StatusStoppedIcon";

/**
 *
 * @param {string} status
 * @param {E_CARD_STATUS} [defaultValue]
 */
export function identifyStatus(status, defaultValue = E_CARD_STATUS.NORMAL) {
  switch (status.toLowerCase()) {
    case "incident happened":
    case "incident occurred":
      return E_CARD_STATUS.INCIDENT;
    case "normal":
      return E_CARD_STATUS.NORMAL;
    case "claimable":
      return E_CARD_STATUS.CLAIMABLE;
    case "false reporting":
      return E_CARD_STATUS.FALSE_REPORTING;
    case "diversified":
      return E_CARD_STATUS.DIVERSIFIED;
    default:
      return defaultValue;
  }
}

export const E_CARD_STATUS = {
  NORMAL: "NORMAL",
  INCIDENT: "INCIDENT",
  CLAIMABLE: "CLAIMABLE",
  STOPPED: "STOPPED",
  FALSE_REPORTING: "FALSE_REPORTING",
  DIVERSIFIED: "DIVERSIFIED",
};

/**
 * @typedef {object} I_CARD
 * @prop {string} label
 * @prop {string} className
 * @prop {JSX.Element} [icon]
 *
 * @typedef {Object.<E_CARD_STATUS, I_CARD>} E_CARD_STATUS
 *
 */
const CARD_STATUS = {
  [E_CARD_STATUS.NORMAL]: {
    label: "Normal",
    className: "bg-21AD8C",
    icon: StatusNormalIcon,
  },
  [E_CARD_STATUS.INCIDENT]: {
    label: "Incident Occured",
    className: "bg-FA5C2F",
    icon: StatusIncidentOccurredIcon,
  },
  [E_CARD_STATUS.CLAIMABLE]: {
    label: "Claimable",
    className: "bg-4289F2",
    icon: StatusClaimableIcon,
  },
  [E_CARD_STATUS.STOPPED]: {
    label: "Stopped",
    className: "bg-364253",
    icon: StatusStoppedIcon,
  },
  [E_CARD_STATUS.FALSE_REPORTING]: {
    label: "False Reporting",
    className: "bg-21AD8C",
    icon: StatusFalseReportingIcon,
  },
  [E_CARD_STATUS.DIVERSIFIED]: {
    label: "Diversified",
    className: "bg-364253",
    icon: () => null,
  },
};

/**
 * @param {object} param
 * @param {E_CARD_STATUS} param.status
 * @param {string} [param.className]
 * @param {E_CARD_STATUS} [param.defaultValue]
 * @param {Object.<string, { label: string, className: string}>} [param.override]
 * @param {boolean} [param.icon]
 * @returns
 */
export const Badge = ({
  status,
  className,
  defaultValue = CARD_STATUS.NORMAL,
  icon = false,
  ...props
}) => {
  const info = CARD_STATUS[status] || defaultValue;

  return (
    <div className="text-FEFEFF" {...props}>
      <div
        className={classNames(
          "px-2 font-poppins text-xs whitespace-nowrap",
          className,
          info.className
        )}
      >
        {icon && <info.icon width="14" height="14" className="mr-1" />}
        {info.label}
      </div>
    </div>
  );
};
