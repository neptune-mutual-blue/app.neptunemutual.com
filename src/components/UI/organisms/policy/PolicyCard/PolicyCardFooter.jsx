import { getParsedKey } from "@/src/helpers/cover";

import { convertFromUnits, isGreater } from "@/utils/bn";
import { classNames } from "@/utils/classnames";
import DateLib from "@/lib/date/DateLib";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatter/currency";
import { fromNow } from "@/utils/formatter/relative-time";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";

export const PolicyCardFooter = ({
  coverKey,
  report,
  cxTokenAddress,
  validityStartsAt,
  validityEndsAt,
}) => {
  const { balance: cxTokenBalance } = useERC20Balance({
    tokenAddress: cxTokenAddress,
  });

  const now = DateLib.unix();

  const isClaimable = report ? report.status == "Claimable" : false;
  const isClaimStarted = report && isGreater(now, report.claimBeginsFrom);
  const isClaimExpired = report && isGreater(now, report.claimExpiresAt);
  const isPolicyExpired = isGreater(now, validityEndsAt);

  const stats = [];
  if (isClaimable && isClaimStarted && !isClaimExpired) {
    stats.push({
      title: "Claim Before",
      tooltipText: DateLib.toLongDateFormat(report.claimExpiresAt),
      value: fromNow(report.claimExpiresAt),
      variant: "error",
    });
  } else if (isClaimable && !isClaimStarted) {
    stats.push({
      title: "Resolution By",
      tooltipText: DateLib.toLongDateFormat(report.claimBeginsFrom),
      value: fromNow(report.claimBeginsFrom),
    });
  } else if (isPolicyExpired) {
    stats.push({
      title: "Expired On",
      tooltipText: DateLib.toLongDateFormat(validityEndsAt),
      value: fromNow(validityEndsAt),
    });
  } else {
    stats.push({
      title: "Expires In",
      tooltipText: DateLib.toLongDateFormat(validityEndsAt),
      value: fromNow(validityEndsAt),
    });
  }

  return (
    <>
      {/* Stats */}
      <div className="flex justify-between flex-wrap text-sm px-1">
        {stats.map((stat, idx) => {
          return (
            <Stat
              key={stat.title}
              title={stat.title}
              tooltip={stat.tooltipText}
              value={stat.value}
              variant={stat.variant}
              right={idx % 2 == 1}
            />
          );
        })}

        <Stat
          title="Purchased Policy"
          tooltip={formatCurrency(convertFromUnits(cxTokenBalance)).long}
          value={formatCurrency(convertFromUnits(cxTokenBalance)).short}
          right
        />
      </div>

      {/* Link */}
      {isClaimable && isClaimStarted && !isClaimExpired && (
        <Link
          href={`/my-policies/${getParsedKey(coverKey)}/${
            report.incidentDate
          }/claim`}
        >
          <a className="flex justify-center py-2.5 w-full bg-4e7dd9 text-white text-sm font-semibold uppercase rounded-lg mt-2 mb-4">
            CLAIM
          </a>
        </Link>
      )}
    </>
  );
};

const Stat = ({ title, tooltip, value, right, variant }) => {
  return (
    <div
      className={classNames("flex flex-col basis-1/2", right && "items-end")}
    >
      <h5 className="font-semibold text-black text-sm mb-2">{title}</h5>
      <p
        title={tooltip}
        className={classNames(
          "mb-4",
          variant === "error" ? "text-FA5C2F" : "text-7398C0"
        )}
      >
        {value}
      </p>
    </div>
  );
};
