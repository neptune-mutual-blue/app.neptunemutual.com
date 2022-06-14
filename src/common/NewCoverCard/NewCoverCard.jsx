import { InfoTooltip } from "@/common/NewCoverCard/InfoTooltip";
import { StackedBrands } from "@/common/NewCoverCard/StackedBrands";
import { StatusBadge } from "@/common/NewCoverCard/StatusBadge";
import { ProgressBar } from "@/common/ProgressBar/ProgressBar";
import { CoverRateIcon } from "@/icons/CoverRateIcon";
import { PieChartIcon } from "@/icons/PieChartIcon";
import { ProtectionIcon } from "@/icons/ProtectionIcon";
import { MULTIPLIER } from "@/src/config/constants";
import { convertFromUnits } from "@/utils/bn";
import { classNames } from "@/utils/classnames";
import { formatCurrency } from "@/utils/formatter/currency";
import { formatPercent } from "@/utils/formatter/percent";

const NewCoverCard = ({
  name,
  utilization,
  protection,
  liquidity,
  levarageRatio,
  products,
  totalProducts,
  pricingCeiling,
  pricingFloor,
  status,
}) => {
  const stats = {
    utilization: formatPercent(utilization, "en"),
    protection: {
      short: formatCurrency(convertFromUnits(protection).toString(), "en")
        .short,
      long: formatCurrency(convertFromUnits(protection).toString(), "en").long,
    },
    liquidity: {
      short: formatCurrency(convertFromUnits(liquidity).toString(), "en").short,
      long: formatCurrency(convertFromUnits(liquidity).toString(), "en").long,
    },
    coverRate: {
      from: formatPercent(pricingFloor / MULTIPLIER, "en", false),
      to: formatPercent(pricingCeiling / MULTIPLIER, "en", false),
    },
  };

  return (
    <div className="px-10 py-12 bg-white border rounded-2xl border-B0C4DB hover:shadow-coverCard">
      <div className="flex items-center gap-x-1">
        <InfoTooltip
          infoComponent={
            <>
              <span>
                Levarage Ratio: <b>{levarageRatio}x</b>
              </span>
              <span>Determines available capital to underwrite.</span>
            </>
          }
        >
          <div className="flex items-center gap-x-1">
            <PieChartIcon />
            <span className="text-sm font-semibold leading-4 text-opacity-40 font-poppins text-01052D">
              {levarageRatio}x
            </span>
          </div>
        </InfoTooltip>

        <InfoTooltip infoComponent={status} arrow={false} className="p-2">
          <div>
            <StatusBadge status={status} />
          </div>
        </InfoTooltip>
      </div>

      <div className="flex items-center justify-between mt-2">
        <h2 className="text-lg font-semibold leading-6 tracking-wider uppercase text-01052D font-sora">
          {name}
        </h2>

        <InfoTooltip
          infoComponent={
            <>
              <span>
                Floor Price: <b>{stats.coverRate.from}%</b>
              </span>
              <span>
                Ceiling Price: <b>{stats.coverRate.to}%</b>
              </span>
            </>
          }
          className="p-4 pl-3"
        >
          <div className="flex items-center gap-x-1">
            <CoverRateIcon />
            <span className="text-sm font-semibold font-poppins">
              {stats.coverRate.from}-{stats.coverRate.to}%
            </span>
          </div>
        </InfoTooltip>
      </div>

      <div className="flex items-center mt-2 gap-x-2.5">
        <StackedBrands brands={products} />
        {totalProducts > 4 && (
          <span className="text-xs leading-4 text-01052D text-opacity-40 font-poppins">
            +{totalProducts - 4} more
          </span>
        )}
      </div>

      <hr className={classNames("my-6 border-t border-AABDCB")} />

      <div className="flex items-center justify-between text-sm font-poppins text-01052D">
        <span className="uppercase">Utilization Ratio</span>
        <span className="font-semibold">{stats.utilization}</span>
      </div>

      <div className="mt-2">
        <InfoTooltip
          infoComponent={
            <>
              <span className="font-semibold">
                UTILIZATION RATIO: {stats.utilization}
              </span>
              <span>Protection: {stats.protection.long}</span>
              <span>Liquidity {stats.liquidity.long}</span>
            </>
          }
        >
          <div>
            <ProgressBar value={utilization} fgClass="bg-4e7dd9" />
          </div>
        </InfoTooltip>
      </div>

      <div className="flex items-center justify-between mt-2 text-sm font-poppins text-01052D text-opacity-40">
        <InfoTooltip
          infoComponent={`Protection: ${stats.protection.long}`}
          arrow={false}
          className="p-2"
        >
          <div className="flex items-center gap-x-0.5">
            <ProtectionIcon />
            <span>{stats.protection.short}</span>
          </div>
        </InfoTooltip>

        <InfoTooltip
          infoComponent={`Liquidity: ${stats.liquidity.long}`}
          arrow={false}
          className="p-2"
        >
          <span>{stats.liquidity.short}</span>
        </InfoTooltip>
      </div>
    </div>
  );
};

export { NewCoverCard };
