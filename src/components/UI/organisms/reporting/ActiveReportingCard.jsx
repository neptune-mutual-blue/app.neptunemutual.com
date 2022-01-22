import { Divider } from "@/components/UI/atoms/divider";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { ProgressBar } from "@/components//UI/atoms/progress-bar";
import { formatWithAabbreviation } from "@/utils/formatter";
import { getCoverImgSrc } from "@/src/helpers/cover";

export const ActiveReportingCard = ({ details }) => {
  const { name, key, coverFees, utilizationRatio, protection, reportedOn } =
    details;

  const imgSrc = getCoverImgSrc({ key: key });
  return (
    <OutlinedCard className="bg-white p-6" type="link">
      <div className="flex justify-between">
        <div>
          <div className="w-18 h-18 bg-DEEAF6 rounded-full">
            <img src={imgSrc} alt={name} className="inline-block max-w-full" />
          </div>
          <h4 className="text-h4 font-sora font-semibold uppercase mt-4">
            {name}
          </h4>
          <div className="text-sm text-7398C0 uppercase mt-2">
            cover fee: {coverFees.min}-{coverFees.max}%
          </div>
        </div>
      </div>

      {/* Divider */}
      <Divider />

      {/* Stats */}
      <div className="flex justify-between text-sm px-1">
        <span className="uppercase">utilization Ratio</span>
        <span className="font-semibold text-right">{utilizationRatio}%</span>
      </div>
      <div className="mt-2 mb-4">
        <ProgressBar value={utilizationRatio / 100} />
      </div>
      <div className="flex justify-between text-sm px-1">
        <span className="">
          Protection: ${formatWithAabbreviation(protection)}
        </span>
        <span className="text-right">Reported On: {reportedOn}</span>
      </div>
    </OutlinedCard>
  );
};
