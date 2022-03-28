import { Divider } from "@/components/UI/atoms/divider";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { ProgressBar } from "@/components//UI/atoms/progress-bar";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { formatCurrency } from "@/utils/formatter/currency";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";
import { formatPercent } from "@/utils/formatter/percent";
import { MULTIPLIER } from "@/src/config/constants";
import { convertFromUnits } from "@/utils/bn";
import { useCoverStatusInfo } from "@/src/hooks/useCoverStatusInfo";
import { CardStatusBadge } from "@/components/CardStatusBadge";

export const ActiveReportingCard = ({ coverKey, incidentDate }) => {
  const { coverInfo } = useCoverInfo(coverKey);
  const statusInfo = useCoverStatusInfo(coverKey);
  const data = coverInfo.stats;

  const imgSrc = getCoverImgSrc({ key: coverKey });

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
          {formatPercent(data.utilization)}
        </span>
      </div>
      <div className="mt-2 mb-4">
        <ProgressBar value={data.utilization} />
      </div>
      <div className="flex justify-between px-1 text-sm">
        <span
          className=""
          title={
            formatCurrency(convertFromUnits(data.protection).toString()).long
          }
        >
          Protection:{" "}
          {formatCurrency(convertFromUnits(data.protection).toString()).short}
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
