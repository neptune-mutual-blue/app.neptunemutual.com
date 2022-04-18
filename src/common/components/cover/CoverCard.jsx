import { Divider } from "@/common/components/Divider/Divider";
import { ProgressBar } from "@/common/components/ProgressBar/ProgressBar";
import { OutlinedCard } from "@/common/components/OutlinedCard/OutlinedCard";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { formatCurrency } from "@/utils/formatter/currency";
import { convertFromUnits, toBN } from "@/utils/bn";
import { formatPercent } from "@/utils/formatter/percent";
import { MULTIPLIER } from "@/src/config/constants";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { useCoverStatusInfo } from "@/src/hooks/useCoverStatusInfo";
import { CardStatusBadge } from "@/src/common/components/CardStatusBadge";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { useCommitment } from "@/src/hooks/provide-liquidity/useCommitment";

export const CoverCard = ({ details }) => {
  const { projectName, key, ipfsData } = details;
  const { coverInfo } = useCoverInfo(key);
  const statusInfo = useCoverStatusInfo(key);
  const { info: liquidityInfo } = useMyLiquidityInfo({ coverKey: key });
  const { commitment } = useCommitment({ coverKey: key });
  const imgSrc = getCoverImgSrc(coverInfo);

  const liquidity = liquidityInfo.totalLiquidity;
  const protection = commitment;
  const utilization = toBN(liquidity).isEqualTo(0)
    ? "0"
    : toBN(protection).dividedBy(liquidity).decimalPlaces(2).toString();

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
          <CardStatusBadge status={statusInfo.status} />
        </div>
      </div>

      <h4 className="mt-4 font-semibold uppercase text-h4 font-sora">
        {projectName}
      </h4>
      <div className="mt-1 uppercase text-h7 lg:text-sm text-7398C0 lg:mt-2">
        Cover fee: {formatPercent(ipfsData.pricingFloor / MULTIPLIER)}-
        {formatPercent(ipfsData.pricingCeiling / MULTIPLIER)}
      </div>

      {/* Divider */}
      <Divider className="mb-4 lg:mb-8" />

      {/* Stats */}
      <div className="flex justify-between px-1 text-h7 lg:text-sm">
        <span className="uppercase text-h7 lg:text-sm">utilization Ratio</span>
        <span className="font-semibold text-right text-h7 lg:text-sm ">
          {formatPercent(utilization)}
        </span>
      </div>
      <div className="mt-2 mb-4">
        <ProgressBar value={utilization} />
      </div>
      <div className="flex justify-between px-1 text-h7 lg:text-sm">
        <div
          className="flex-1"
          title={formatCurrency(convertFromUnits(commitment).toString()).long}
        >
          Protection:{" "}
          {formatCurrency(convertFromUnits(commitment).toString()).short}
        </div>

        <div
          className="flex-1 text-right"
          title={formatCurrency(convertFromUnits(liquidity).toString()).long}
        >
          Liquidity:{" "}
          {formatCurrency(convertFromUnits(liquidity).toString()).short}
        </div>
      </div>
    </OutlinedCard>
  );
};
