import { useEffect } from "react";
import { useRouter } from "next/router";

import { Divider } from "@/common/Divider/Divider";
import { ProgressBar } from "@/common/ProgressBar/ProgressBar";
import { OutlinedCard } from "@/common/OutlinedCard/OutlinedCard";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { formatCurrency } from "@/utils/formatter/currency";
import { convertFromUnits, toBN } from "@/utils/bn";
import { formatPercent } from "@/utils/formatter/percent";
import { MULTIPLIER } from "@/src/config/constants";
import { CardStatusBadge } from "@/common/CardStatusBadge";
import { Trans } from "@lingui/macro";
import { useFetchCoverStats } from "@/src/hooks/useFetchCoverStats";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { useSortableStats } from "@/src/context/SortableStatsContext";

export const CoverCard = ({ details }) => {
  const router = useRouter();
  const { setStatsByKey } = useSortableStats();

  const { projectName, key, pricingFloor, pricingCeiling } = details;
  const { info: liquidityInfo } = useMyLiquidityInfo({ coverKey: key });
  const { commitment, status } = useFetchCoverStats({
    coverKey: key,
  });

  const imgSrc = getCoverImgSrc({ key });

  const liquidity = liquidityInfo.totalLiquidity;
  const protection = commitment;
  const utilization = toBN(liquidity).isEqualTo(0)
    ? "0"
    : toBN(protection).dividedBy(liquidity).decimalPlaces(2).toString();

  // Used for sorting purpose only
  useEffect(() => {
    setStatsByKey(key, {
      liquidity,
      utilization,
    });
  }, [key, liquidity, setStatsByKey, utilization]);

  return (
    <OutlinedCard className="p-6 bg-white" type="link">
      <div className="flex items-start justify-between">
        <div className="">
          <img
            src={imgSrc}
            alt={projectName}
            className="inline-block max-w-full w-14 lg:w-18"
          />
        </div>
        <div>
          <CardStatusBadge status={status} />
        </div>
      </div>

      <h4 className="mt-4 font-semibold uppercase text-h4 font-sora">
        {projectName}
      </h4>
      <div className="mt-1 uppercase text-h7 lg:text-sm text-7398C0 lg:mt-2">
        <Trans>Cover fee:</Trans>{" "}
        {formatPercent(pricingFloor / MULTIPLIER, router.locale)}-
        {formatPercent(pricingCeiling / MULTIPLIER, router.locale)}
      </div>

      {/* Divider */}
      <Divider className="mb-4 lg:mb-8" />

      {/* Stats */}
      <div className="flex justify-between px-1 text-h7 lg:text-sm">
        <span className="uppercase text-h7 lg:text-sm">utilization Ratio</span>
        <span className="font-semibold text-right text-h7 lg:text-sm ">
          {formatPercent(utilization, router.locale)}
        </span>
      </div>
      <div className="mt-2 mb-4">
        <ProgressBar value={utilization} />
      </div>
      <div className="flex justify-between px-1 text-h7 lg:text-sm">
        <div
          className="flex-1"
          title={
            formatCurrency(
              convertFromUnits(commitment).toString(),
              router.locale
            ).long
          }
        >
          <Trans>Protection:</Trans>{" "}
          {
            formatCurrency(
              convertFromUnits(commitment).toString(),
              router.locale
            ).short
          }
        </div>

        <div
          className="flex-1 text-right"
          title={
            formatCurrency(
              convertFromUnits(liquidity).toString(),
              router.locale
            ).long
          }
        >
          <Trans>Liquidity:</Trans>{" "}
          {
            formatCurrency(
              convertFromUnits(liquidity).toString(),
              router.locale
            ).short
          }
        </div>
      </div>
    </OutlinedCard>
  );
};
