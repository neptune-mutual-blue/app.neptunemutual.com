import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { Divider } from "@/common/Divider/Divider";
import { ProgressBar } from "@/common/ProgressBar/ProgressBar";
import { OutlinedCard } from "@/common/OutlinedCard/OutlinedCard";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { formatCurrency } from "@/utils/formatter/currency";
import { convertFromUnits, toBN } from "@/utils/bn";
import { formatPercent } from "@/utils/formatter/percent";
import { MULTIPLIER } from "@/src/config/constants";
import { Trans } from "@lingui/macro";
import { useFetchCoverStats } from "@/src/hooks/useFetchCoverStats";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { useSortableStats } from "@/src/context/SortableStatsContext";
import { useAppConstants } from "@/src/context/AppConstants";
import { utils } from "@neptunemutual/sdk";
import { classNames } from "@/utils/classnames";
import { CardStatusBadge } from "@/common/CardStatusBadge";
import { InfoTooltip } from "@/common/Cover/InfoTooltip";
import SheildIcon from "@/icons/SheildIcon";

export const CoverCard = ({
  coverKey,
  coverInfo,
  progressFgColor = undefined,
  progressBgColor = undefined,
}) => {
  const router = useRouter();
  const { setStatsByKey } = useSortableStats();
  const { liquidityTokenDecimals } = useAppConstants();

  const productKey = utils.keyUtil.toBytes32("");
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

  const productsImg = isDiversified
    ? coverInfo.products?.map((item) =>
        getCoverImgSrc({ key: item.productKey })
      )
    : [];
  const slicedProductsImg = isDiversified ? productsImg.slice(0, 3) : [];

  const protectionLong = formatCurrency(
    convertFromUnits(activeCommitment, liquidityTokenDecimals).toString(),
    router.locale
  ).long;

  const liquidityLong = formatCurrency(
    convertFromUnits(liquidity, liquidityTokenDecimals).toString(),
    router.locale
  ).long;

  return (
    <OutlinedCard className="p-6 bg-white" type="link">
      <div className="flex items-start">
        <div className="relative flex items-center grow">
          {slicedProductsImg.length ? (
            slicedProductsImg.slice(0, 3).map((item, idx) => {
              const more = productsImg.length - 3;
              return (
                <React.Fragment key={item}>
                  <div
                    className={classNames(
                      "inline-block max-w-full bg-FEFEFF rounded-full w-14 lg:w-18",
                      idx !== 0 && "-ml-7 lg:-ml-9 p-0.5"
                    )}
                  >
                    <img
                      src={item}
                      alt={coverInfo.products[idx].productName}
                      className="rounded-full bg-DEEAF6"
                      data-testid="cover-img"
                    />
                  </div>

                  {idx === slicedProductsImg.length - 1 && more > 0 && (
                    <p className="ml-2 text-xs opacity-40 text-01052D">
                      +{more} <Trans>MORE</Trans>
                    </p>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <div
              className={classNames(
                "inline-block max-w-full bg-FEFEFF rounded-full w-14 lg:w-18"
              )}
            >
              <img
                src={imgSrc}
                alt={coverInfo.infoObj.projectName}
                className="rounded-full bg-DEEAF6"
                data-testid="cover-img"
              />
            </div>
          )}
        </div>

        <InfoTooltip
          disabled={coverInfo.products?.length === 0}
          infoComponent={
            <div>
              <p>
                Leverage Ration: <b>{coverInfo.infoObj?.leverage}x</b>
              </p>
              <p>Determines available capital to underwrite</p>
            </div>
          }
        >
          <div>
            <CardStatusBadge
              status={isDiversified ? "Diversified" : coverStatus}
            />
          </div>
        </InfoTooltip>
      </div>
      <h4
        className="mt-4 font-semibold text-black uppercase text-h4 font-sora"
        data-testid="project-name"
      >
        {isDiversified
          ? coverInfo.infoObj.coverName
          : coverInfo.infoObj.projectName}
      </h4>
      <div
        className="mt-1 uppercase text-h7 opacity-40 lg:text-sm text-01052D lg:mt-2"
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
        <span className="uppercase text-h7 lg:text-sm">
          <Trans>utilization Ratio</Trans>
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
                <Trans>UTILIZATION RATIO:</Trans>{" "}
                {formatPercent(utilization, router.locale)}
              </b>
            </p>
            <p>
              <Trans>Protection</Trans>: {protectionLong}
            </p>
            <p>
              <Trans>Liquidity</Trans>: {liquidityLong}
            </p>
          </div>
        }
      >
        <div className="mt-2 mb-4">
          <ProgressBar
            value={utilization}
            bgClass={progressBgColor}
            fgClass={progressFgColor}
          />
        </div>
      </InfoTooltip>

      <div className="flex justify-between px-1 text-01052D opacity-40 text-h7 lg:text-sm">
        <InfoTooltip
          arrow={false}
          infoComponent={
            <div>
              <Trans>Protection</Trans>: {protectionLong}
            </div>
          }
        >
          <div
            className="flex flex-1"
            title={protectionLong}
            data-testid="protection"
          >
            <SheildIcon className="w-4 h-4 text-01052D" />
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
              <Trans>Liquidity</Trans>: {liquidityLong}
            </div>
          }
        >
          <div
            className="flex-1 text-right"
            title={liquidityLong}
            data-testid="liquidity"
          >
            {
              formatCurrency(
                convertFromUnits(liquidity, liquidityTokenDecimals).toString(),
                router.locale
              ).short
            }
          </div>
        </InfoTooltip>
      </div>
    </OutlinedCard>
  );
};
