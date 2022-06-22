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
import { useAppConstants } from "@/src/context/AppConstants";
import { utils } from "@neptunemutual/sdk";

export const CoverCard = ({
  coverKey,
  productKey = utils.keyUtil.toBytes32(""),
  coverInfo,
  progressFgColor = undefined,
  progressBgColor = undefined,
}) => {
  const router = useRouter();
  const { setStatsByKey } = useSortableStats();
  const { liquidityTokenDecimals } = useAppConstants();

  const { info: liquidityInfo } = useMyLiquidityInfo({ coverKey: coverKey });
  const { activeCommitment, coverStatus } = useFetchCoverStats({
    coverKey: coverKey,
    productKey: productKey,
  });

  const imgSrc = getCoverImgSrc({ key: coverKey });

  const liquidity = liquidityInfo.totalLiquidity;
  const protection = activeCommitment;
  const utilization = toBN(liquidity).isEqualTo(0)
    ? "0"
    : toBN(protection).dividedBy(liquidity).decimalPlaces(2).toString();

  const isDiversified = coverInfo?.supportsProducts;

  const id = `${coverKey}-${productKey}`;
  // Used for sorting purpose only
  useEffect(() => {
    setStatsByKey(id, {
      liquidity,
      utilization,
    });
  }, [id, liquidity, setStatsByKey, utilization]);

  return (
    <OutlinedCard className="p-6 bg-white" type="link">
      <div className="flex items-start justify-between">
        <div className="">
          <img
            src={imgSrc}
            alt={coverInfo.infoObj.projectName}
            className="inline-block max-w-full w-14 lg:w-18"
            data-testid="cover-img"
          />
        </div>
        <div>
          <CardStatusBadge
            status={isDiversified ? "Diversified" : coverStatus}
          />
        </div>
      </div>

      <h4
        className="mt-4 font-semibold uppercase text-h4 font-sora"
        data-testid="project-name"
      >
        {isDiversified
          ? coverInfo.infoObj.coverName
          : coverInfo.infoObj.projectName}
      </h4>
      <div
        className="mt-1 uppercase text-h7 lg:text-sm text-7398C0 lg:mt-2"
        data-testid="cover-fee"
      >
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
      <Divider className="mb-4 lg:mb-8" />

      {/* Stats */}
      <div className="flex justify-between px-1 text-h7 lg:text-sm">
        <span className="uppercase text-h7 lg:text-sm">utilization Ratio</span>
        <span
          className="font-semibold text-right text-h7 lg:text-sm "
          data-testid="util-ratio"
        >
          {formatPercent(utilization, router.locale)}
        </span>
      </div>
      <div className="mt-2 mb-4">
        <ProgressBar
          value={utilization}
          bgClass={progressBgColor}
          fgClass={progressFgColor}
        />
      </div>
      <div className="flex justify-between px-1 text-h7 lg:text-sm">
        <div
          className="flex-1"
          title={
            formatCurrency(
              convertFromUnits(
                activeCommitment,
                liquidityTokenDecimals
              ).toString(),
              router.locale
            ).long
          }
          data-testid="protection"
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
        </div>

        <div
          className="flex-1 text-right"
          title={
            formatCurrency(
              convertFromUnits(liquidity, liquidityTokenDecimals).toString(),
              router.locale
            ).long
          }
          data-testid="liquidity"
        >
          <Trans>Liquidity:</Trans>{" "}
          {
            formatCurrency(
              convertFromUnits(liquidity, liquidityTokenDecimals).toString(),
              router.locale
            ).short
          }
        </div>
      </div>
    </OutlinedCard>
  );
};
