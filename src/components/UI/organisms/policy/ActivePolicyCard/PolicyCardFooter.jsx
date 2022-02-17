import { getParsedKey } from "@/src/helpers/cover";
import { convertFromUnits } from "@/utils/bn";
import { classNames } from "@/utils/classnames";
import { getToolTipDate, unixToDate } from "@/utils/date";
import Link from "next/link";

export const PolicyCardFooter = ({ policyInfo, ...rest }) => {
  const { totalAmountToCover, expiresOn, cover, cxToken } = policyInfo;
  const coverKey = cover.id;

  const { status, report } = rest;

  const statusType = ["Reporting", "FalseReporting"].includes(status)
    ? "failure"
    : "";
  const isClaimable = false;

  return (
    <>
      {/* Stats */}
      <div className="flex justify-between text-sm px-1 pb-4">
        {report ? (
          <Stat
            title="Resolution By"
            toolTipTitle={getToolTipDate(report.resolutionTimestamp)}
            value={
              unixToDate(report.resolutionTimestamp, "YYYY/MM/DD HH:mm") +
              " UTC"
            }
          />
        ) : (
          <Stat
            title="Expires In"
            toolTipTitle={getToolTipDate(expiresOn)}
            value={unixToDate(expiresOn, "YYYY/MM/DD HH:mm") + " UTC"}
          />
        )}

        <Stat
          title="Purchased Policy"
          value={`$ ${convertFromUnits(totalAmountToCover).toString()}`}
          right
        />
      </div>

      {/* Link */}
      {isClaimable && (
        <Link href={`/my-policies/${getParsedKey(coverKey)}/claim`}>
          <a className="flex justify-center py-2.5 w-full bg-4e7dd9 text-white text-sm font-semibold rounded-lg mt-2 mb-4">
            CLAIM
          </a>
        </Link>
      )}
    </>
  );
};

const Stat = ({ title, toolTipTitle, value, right, variant }) => {
  return (
    <div className="flex flex-col">
      <span className="font-semibold text-black text-sm pb-2">{title}</span>
      <span
        title={toolTipTitle}
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
