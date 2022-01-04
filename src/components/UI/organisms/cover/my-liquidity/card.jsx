import { Badge } from "@/components/UI/atoms/badge";
import { Divider } from "@/components/UI/atoms/divider";
import { ProgressBar } from "@/components/UI/atoms/progress-bar";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { amountFormatter } from "@/utils/formatter";

export const CoverCard = ({ details }) => {
  const {
    name,
    coverFees,
    imgSrc,
    apr,
    utilizationRatio,
    protection,
    liquidity,
  } = details;

  return (
    <OutlinedCard className="bg-white p-6" type="link">
      <div className="flex justify-between">
        <div>
          <div className="w-18 h-18 bg-DEEAF6 p-3 rounded-full">
            <img src={imgSrc} alt={name} className="inline-block max-w-full" />
          </div>
          <h4 className="text-h4 font-sora font-semibold uppercase mt-4">
            {name}
          </h4>
        </div>
        <div>
          <Badge>APR: {apr}%</Badge>
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
        <span className="">My Liquidity: {amountFormatter(protection)} POD</span>
      </div>
    </OutlinedCard>
  );
};
