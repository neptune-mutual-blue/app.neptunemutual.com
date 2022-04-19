import { Divider } from "@/common/Divider/Divider";
import { OutlinedCard } from "@/common/OutlinedCard/OutlinedCard";
import { ProgressBar } from "@/common/ProgressBar/ProgressBar";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { formatCurrency } from "@/utils/formatter/currency";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";
import { formatPercent } from "@/utils/formatter/percent";
import { MULTIPLIER } from "@/src/config/constants";
import { convertFromUnits, toBN } from "@/utils/bn";
import { useCoverStatusInfo } from "@/src/hooks/useCoverStatusInfo";
import { CardStatusBadge } from "@/common/CardStatusBadge";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { useCommitment } from "@/src/hooks/provide-liquidity/useCommitment";

export const ActiveReportingCard = ({ coverKey, incidentDate }) => {
  const { coverInfo } = useCoverInfo(coverKey);
  const statusInfo = useCoverStatusInfo(coverKey);
  const { info: liquidityInfo } = useMyLiquidityInfo({ coverKey });
  const { commitment } = useCommitment({ coverKey });

  const imgSrc = getCoverImgSrc({ key: coverKey });

  const liquidity = liquidityInfo.totalLiquidity;
  const protection = commitment;
  const utilization = toBN(liquidity).isEqualTo(0)
    ? "0"
    : toBN(protection).dividedBy(liquidity).decimalPlaces(2).toString();

  return (
    <OutlinedCard className="p-6 bg-white" type="link">
      <div className="flex items-start justify-between">
        <div className="rounded-full w-18 h-18 bg-DEEAF6">
          <img
            src={imgSrc}
            alt={coverInfo.projectName}
            className="inline-block max-w-full"
          />
        </div>
        <div>
          <CardStatusBadge status={statusInfo.status} />
        </div>
      </div>
      <h4 className="mt-4 font-semibold uppercase text-h4 font-sora">
        {coverInfo.projectName}
      </h4>
      <div className="mt-2 text-sm uppercase text-7398C0">
        Cover fee:{" "}
        {formatPercent(coverInfo.ipfsData?.pricingFloor / MULTIPLIER)}-
        {formatPercent(coverInfo.ipfsData?.pricingCeiling / MULTIPLIER)}
      </div>

      {/* Divider */}
      <Divider />

      {/* Stats */}
      <div className="flex justify-between px-1 text-sm">
        <span className="uppercase">utilization Ratio</span>
        <span className="font-semibold text-right">
          {formatPercent(utilization)}
        </span>
      </div>
      <div className="mt-2 mb-4">
        <ProgressBar value={utilization} />
      </div>
      <div className="flex justify-between px-1 text-sm">
        <span
          className=""
          title={formatCurrency(convertFromUnits(commitment).toString()).long}
        >
          Protection:{" "}
          {formatCurrency(convertFromUnits(commitment).toString()).short}
        </span>
        <span
          className="text-right"
          title={DateLib.toLongDateFormat(incidentDate)}
        >
          Reported On:{" "}
          <span title={DateLib.toLongDateFormat(incidentDate)}>
            {fromNow(incidentDate)}
          </span>
        </span>
      </div>
    </OutlinedCard>
  );
};
