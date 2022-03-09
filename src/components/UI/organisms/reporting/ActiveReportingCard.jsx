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

export const ActiveReportingCard = ({ coverKey, incidentDate }) => {
  const { coverInfo } = useCoverInfo(coverKey);
  const data = coverInfo.stats;

  const imgSrc = getCoverImgSrc({ key: coverKey });
  return (
    <OutlinedCard className="bg-white p-6" type="link">
      <div className="flex justify-between">
        <div>
          <div className="w-18 h-18 bg-DEEAF6 rounded-full">
            <img
              src={imgSrc}
              alt={coverInfo.projectName}
              className="inline-block max-w-full"
            />
          </div>
          <h4 className="text-h4 font-sora font-semibold uppercase mt-4">
            {coverInfo.projectName}
          </h4>
          <div className="text-sm text-7398C0 uppercase mt-2">
            Cover fee:{" "}
            {formatPercent(coverInfo.ipfsData?.pricingFloor / MULTIPLIER)}-
            {formatPercent(coverInfo.ipfsData?.pricingCeiling / MULTIPLIER)}
          </div>
        </div>
      </div>

      {/* Divider */}
      <Divider />

      {/* Stats */}
      <div className="flex justify-between text-sm px-1">
        <span className="uppercase">utilization Ratio</span>
        <span className="font-semibold text-right">
          {formatPercent(data.utilization)}
        </span>
      </div>
      <div className="mt-2 mb-4">
        <ProgressBar value={data.utilization} />
      </div>
      <div className="flex justify-between text-sm px-1">
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
