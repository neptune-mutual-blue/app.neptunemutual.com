import { useEffect } from "react";
import { useRouter } from "next/router";

import { Divider } from "@/common/Divider/Divider";
import { OutlinedCard } from "@/common/OutlinedCard/OutlinedCard";
import { ProgressBar } from "@/common/ProgressBar/ProgressBar";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { formatCurrency } from "@/utils/formatter/currency";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";
import { formatPercent } from "@/utils/formatter/percent";
import { MULTIPLIER } from "@/src/config/constants";
import { convertFromUnits, toBN } from "@/utils/bn";
import { CardStatusBadge } from "@/common/CardStatusBadge";
import { Trans } from "@lingui/macro";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { useFetchCoverStats } from "@/src/hooks/useFetchCoverStats";
import { useSortableStats } from "@/src/context/SortableStatsContext";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { useAppConstants } from "@/src/context/AppConstants";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";

export const ActiveReportingCard = ({
  id,
  coverKey,
  productKey = safeFormatBytes32String(""),
  incidentDate,
}) => {
  const { setStatsByKey } = useSortableStats();
  const { liquidityTokenDecimals } = useAppConstants();
  const coverInfo = useCoverOrProductData({ coverKey, productKey });
  const { info: liquidityInfo } = useMyLiquidityInfo({ coverKey });
  const { activeCommitment, coverStatus, productStatus } = useFetchCoverStats({
    coverKey,
    productKey,
  });
  const router = useRouter();

  const imgSrc = getCoverImgSrc({ key: coverKey });

  const liquidity = liquidityInfo.totalLiquidity;
  const protection = activeCommitment;
  const utilization = toBN(liquidity).isEqualTo(0)
    ? "0"
    : toBN(protection).dividedBy(liquidity).decimalPlaces(2).toString();

  // Used for sorting purpose only
  useEffect(() => {
    setStatsByKey(id, {
      liquidity,
      utilization,
    });
  }, [id, liquidity, setStatsByKey, utilization]);

  if (!coverInfo) {
    return <CardSkeleton numberOfCards={1} />;
  }

  return (
    <OutlinedCard className="p-6 bg-white" type="link">
      <div className="flex items-start justify-between">
        <div className="rounded-full w-18 h-18 bg-DEEAF6">
          <img
            src={imgSrc}
            alt={coverInfo.infoObj.projectName}
            className="inline-block max-w-full"
          />
        </div>
        <div>
          <CardStatusBadge status={coverStatus} />
        </div>
      </div>
      <h4 className="mt-4 font-semibold uppercase text-h4 font-sora">
        {coverInfo.infoObj.projectName}
      </h4>
      <div className="mt-2 text-sm uppercase text-7398C0">
        <Trans>Cover fee:</Trans>{" "}
        {formatPercent(
          coverInfo.infoObj.pricingFloor / MULTIPLIER,
          router.locale
        )}
        -
        {formatPercent(
          coverInfo.infoObj.pricingCeiling / MULTIPLIER,
          router.locale
        )}
      </div>

      {/* Divider */}
      <Divider />

      {/* Stats */}
      <div className="flex justify-between px-1 text-sm">
        <span className="uppercase">
          <Trans>utilization Ratio</Trans>
        </span>
        <span className="font-semibold text-right">
          {formatPercent(utilization, router.locale)}
        </span>
      </div>
      <div className="mt-2 mb-4">
        <ProgressBar value={utilization} />
      </div>
      <div className="flex justify-between px-1 text-sm">
        <span
          className=""
          title={
            formatCurrency(
              convertFromUnits(
                activeCommitment,
                liquidityTokenDecimals
              ).toString(),
              router.locale
            ).long
          }
        >
          <Trans>Protection:</Trans>{" "}
          {
            formatCurrency(
              convertFromUnits(
                activeCommitment,
                liquidityTokenDecimals
              ).toString(),
              router.locale
            ).short
          }
        </span>
        <span
          className="text-right"
          title={DateLib.toLongDateFormat(incidentDate, router.locale)}
        >
          <Trans>Reported On:</Trans>{" "}
          <span title={DateLib.toLongDateFormat(incidentDate, router.locale)}>
            {fromNow(incidentDate)}
          </span>
        </span>
      </div>
    </OutlinedCard>
  );
};
