import { safeParseBytes32String } from "@/src/helpers/cover";

import { convertFromUnits, isGreater } from "@/utils/bn";
import { classNames } from "@/utils/classnames";
import DateLib from "@/lib/date/DateLib";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatter/currency";
import { fromNow } from "@/utils/formatter/relative-time";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";

export const PolicyCardFooter = ({
  coverKey,
  report,
  validityEndsAt,
  tokenBalance,
}) => {
  const now = DateLib.unix();
  const router = useRouter();

  const isClaimable = report ? report.status == "Claimable" : false;
  const isClaimStarted = report && isGreater(now, report.claimBeginsFrom);
  const isClaimExpired = report && isGreater(now, report.claimExpiresAt);
  const isPolicyExpired = isGreater(now, validityEndsAt);

  const hasBalance = isGreater(tokenBalance, "0");
  const withinClaimPeriod =
    hasBalance && isClaimable && isClaimStarted && !isClaimExpired;
  const beforeResolutionDeadline = isClaimable && !isClaimStarted;

  const stats = [];
  if (withinClaimPeriod) {
    stats.push({
      title: t`Claim Before`,
      tooltipText: DateLib.toLongDateFormat(
        report.claimExpiresAt,
        router.locale
      ),
      value: fromNow(report.claimExpiresAt),
      variant: "error",
    });
  } else if (beforeResolutionDeadline) {
    stats.push({
      title: t`Resolution By`,
      tooltipText: DateLib.toLongDateFormat(
        report.claimBeginsFrom,
        router.locale
      ),
      value: fromNow(report.claimBeginsFrom),
    });
  } else if (isPolicyExpired) {
    stats.push({
      title: t`Expired On`,
      tooltipText: DateLib.toLongDateFormat(validityEndsAt, router.locale),
      value: fromNow(validityEndsAt),
    });
  } else {
    stats.push({
      title: t`Expires In`,
      tooltipText: DateLib.toLongDateFormat(validityEndsAt, router.locale),
      value: fromNow(validityEndsAt),
    });
  }

  return (
    <>
      {/* Stats */}
      <div className="flex flex-wrap justify-between px-1 text-sm">
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
          title={t`Purchased Policy`}
          tooltip={
            formatCurrency(convertFromUnits(tokenBalance), router.locale).long
          }
          value={
            formatCurrency(convertFromUnits(tokenBalance), router.locale).short
          }
          right
        />
      </div>

      {/* Link */}
      {withinClaimPeriod && (
        <Link
          href={`/my-policies/${safeParseBytes32String(coverKey)}/${
            report.incidentDate
          }/claim`}
        >
          <a className="flex justify-center py-2.5 w-full bg-4e7dd9 text-white text-sm font-semibold uppercase rounded-lg mt-2 mb-4">
            <Trans>CLAIM</Trans>
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
      <h5 className="mb-2 text-sm font-semibold text-black">{title}</h5>
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
