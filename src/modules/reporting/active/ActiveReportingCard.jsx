import { useEffect } from "react";
import { useRouter } from "next/router";

import { Divider } from "@/common/Divider/Divider";
import { OutlinedCard } from "@/common/OutlinedCard/OutlinedCard";
import { ProgressBar } from "@/common/ProgressBar/ProgressBar";
import { getCoverImgSrc, isValidProduct } from "@/src/helpers/cover";
import { formatCurrency } from "@/utils/formatter/currency";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";
import { formatPercent } from "@/utils/formatter/percent";
import { MULTIPLIER } from "@/src/config/constants";
import { convertFromUnits, toBN } from "@/utils/bn";
import { Badge, E_CARD_STATUS, identifyStatus } from "@/common/CardStatusBadge";
import { Trans } from "@lingui/macro";
import { useFetchCoverStats } from "@/src/hooks/useFetchCoverStats";
import { useSortableStats } from "@/src/context/SortableStatsContext";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { useAppConstants } from "@/src/context/AppConstants";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";
import { InfoTooltip } from "@/common/Cover/InfoTooltip";
import SheildIcon from "@/icons/SheildIcon";

export const ActiveReportingCard = ({
  id,
  coverKey,
  productKey = safeFormatBytes32String(""),
  incidentDate,
}) => {
  const { setStatsByKey } = useSortableStats();
  const { liquidityTokenDecimals } = useAppConstants();
  const coverInfo = useCoverOrProductData({ coverKey, productKey });
  const { info: coverStats } = useFetchCoverStats({
    coverKey,
    productKey,
  });
  const router = useRouter();

  const { activeCommitment, productStatus, availableLiquidity } = coverStats;

  const isDiversified = isValidProduct(productKey);
  const imgSrc = getCoverImgSrc({ key: isDiversified ? productKey : coverKey });

  const liquidity = toBN(availableLiquidity).plus(activeCommitment).toString();
  const protection = activeCommitment;
  const utilization = toBN(liquidity).isEqualTo(0)
    ? "0"
    : toBN(protection).dividedBy(liquidity).decimalPlaces(2).toString();

  // Used for sorting purpose only
  useEffect(() => {
    setStatsByKey(id, {
      liquidity,
      utilization,
      infoObj: coverInfo?.infoObj,
      isDiversified,
    });
  }, [coverInfo, id, isDiversified, liquidity, setStatsByKey, utilization]);

  if (!coverInfo) {
    return <CardSkeleton numberOfCards={1} data-testid="skeleton-card" />;
  }

  const status = identifyStatus(productStatus);

  return (
    <OutlinedCard className="p-6 bg-white" type="link">
      <div className="flex items-start justify-between">
        <div
          className="rounded-full w-18 h-18 bg-DEEAF6"
          data-testid="active-report-cover-img"
        >
          <img
            src={imgSrc}
            alt={coverInfo.infoObj.projectName}
            className="inline-block max-w-full"
          />
        </div>
        <div date-testid="card-badge">
          {status !== E_CARD_STATUS.NORMAL && (
            <Badge status={status} className="rounded" />
          )}
        </div>
      </div>
      <h4 className="mt-4 font-semibold uppercase text-h4 font-sora">
        {isDiversified
          ? coverInfo.infoObj.productName
          : coverInfo.infoObj.projectName}
      </h4>
      <div className="flex items-center justify-between">
        <div
          className="mt-1 text-sm uppercase text-7398C0 lg:mt-2"
          data-testid="cover-fee"
        >
          <Trans>Cover fee:</Trans>{" "}
          {formatPercent(
            (isDiversified
              ? coverInfo.cover.infoObj.pricingFloor
              : coverInfo.infoObj.pricingFloor) / MULTIPLIER,
            router.locale
          )}
          -
          {formatPercent(
            (isDiversified
              ? coverInfo.cover.infoObj.pricingCeiling
              : coverInfo.infoObj.pricingCeiling) / MULTIPLIER,
            router.locale
          )}
        </div>
        {isDiversified && (
          <InfoTooltip
            infoComponent={
              <p>
                <Trans>
                  Diversified pool with {coverInfo.cover.infoObj.leverage}x
                  leverage factor and{" "}
                  {formatPercent(
                    toBN(coverInfo.infoObj.capitalEfficiency)
                      .dividedBy(MULTIPLIER)
                      .toString()
                  )}{" "}
                  capital efficiency
                </Trans>
              </p>
            }
          >
            <div className="rounded bg-EEEEEE font-poppins text-black text-xs px-1 border-9B9B9B border-0.5">
              <p className="opacity-60">
                D{coverInfo.cover.infoObj.leverage}x
                {formatPercent(
                  toBN(coverInfo.infoObj.capitalEfficiency)
                    .dividedBy(MULTIPLIER)
                    .toString(),
                  router.locale,
                  false
                )}
              </p>
            </div>
          </InfoTooltip>
        )}
      </div>

      {/* Divider */}
      <Divider />

      {/* Stats */}
      <div className="flex justify-between px-1 text-h7 lg:text-sm">
        <span className="uppercase text-h7 lg:text-sm">
          <Trans>Utilization ratio</Trans>
        </span>
        <span
          className="font-semibold text-right text-h7 lg:text-sm "
          data-testid="util-ratio"
        >
          {formatPercent(utilization, router.locale)}
        </span>
      </div>

      <InfoTooltip
        infoComponent={
          <div>
            <p>
              <b>
                <Trans>Utilization ratio:</Trans>{" "}
                {formatPercent(utilization, router.locale)}
              </b>
            </p>
            <p>
              <Trans>Protection</Trans>:{" "}
              {
                formatCurrency(
                  convertFromUnits(
                    activeCommitment,
                    liquidityTokenDecimals
                  ).toString(),
                  router.locale
                ).long
              }
            </p>
          </div>
        }
      >
        <div className="mt-2 mb-4">
          <ProgressBar value={utilization} />
        </div>
      </InfoTooltip>

      <div className="flex justify-between px-1 text-01052D opacity-40 text-h7 lg:text-sm">
        <InfoTooltip
          arrow={false}
          infoComponent={
            <div>
              <Trans>Protection</Trans>:{" "}
              {
                formatCurrency(
                  convertFromUnits(
                    activeCommitment,
                    liquidityTokenDecimals
                  ).toString(),
                  router.locale
                ).long
              }
            </div>
          }
        >
          <div
            className="flex flex-1"
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
            <span role="tooltip" aria-label="Protection">
              <SheildIcon className="w-4 h-4 text-01052D" />
            </span>
            <p>
              {
                formatCurrency(
                  convertFromUnits(
                    activeCommitment,
                    liquidityTokenDecimals
                  ).toString(),
                  router.locale
                ).short
              }
            </p>
          </div>
        </InfoTooltip>
        <InfoTooltip
          arrow={false}
          infoComponent={
            <div>
              <Trans>Reported On:</Trans>:{" "}
              {DateLib.toLongDateFormat(incidentDate, router.locale)}
            </div>
          }
        >
          <div
            data-testid="incident-date"
            className="flex-1 text-right"
            title={DateLib.toLongDateFormat(incidentDate, router.locale)}
          >
            {fromNow(incidentDate)}
          </div>
        </InfoTooltip>
      </div>
    </OutlinedCard>
  );
};
