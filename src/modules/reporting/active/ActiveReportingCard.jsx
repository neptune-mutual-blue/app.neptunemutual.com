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
import { CardStatusBadge } from "@/common/CardStatusBadge";
import { Trans } from "@lingui/macro";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { useFetchCoverInfo } from "@/src/hooks/useFetchCoverInfo";
import { useRouter } from "next/router";

export const ActiveReportingCard = ({ coverKey, incidentDate }) => {
  const { coverInfo } = useCoverInfo(coverKey);
  const { info: liquidityInfo } = useMyLiquidityInfo({ coverKey });
  const { commitment, status } = useFetchCoverInfo({
    coverKey,
  });

  const imgSrc = getCoverImgSrc({ key: coverKey });

  const liquidity = liquidityInfo.totalLiquidity;
  const protection = commitment;
  const utilization = toBN(liquidity).isEqualTo(0)
    ? "0"
    : toBN(protection).dividedBy(liquidity).decimalPlaces(2).toString();

  const router = useRouter();

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
          <CardStatusBadge status={status} />
        </div>
      </div>
      <h4 className="mt-4 font-semibold uppercase text-h4 font-sora">
        {coverInfo.projectName}
      </h4>
      <div className="mt-2 text-sm uppercase text-7398C0">
        <Trans>Cover fee:</Trans>{" "}
        {formatPercent(coverInfo.ipfsData?.pricingFloor / MULTIPLIER)}-
        {formatPercent(coverInfo.ipfsData?.pricingCeiling / MULTIPLIER)}
      </div>

      {/* Divider */}
      <Divider />

      {/* Stats */}
      <div className="flex justify-between px-1 text-sm">
        <span className="uppercase">
          <Trans>utilization Ratio</Trans>
        </span>
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
          <Trans>Protection:</Trans>{" "}
          {formatCurrency(convertFromUnits(commitment).toString()).short}
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
