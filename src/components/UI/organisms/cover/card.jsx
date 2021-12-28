import { Badge } from "@/components/UI/atoms/badge";
import { ProgressBar } from "@/components/UI/atoms/progress-bar";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { amountFormatter } from "@/utils/formatter";

export const CoverCard = ({ details, children }) => {
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
          <div className="text-sm text-7398C0 uppercase mt-2">
            cover fee: {coverFees.min}-{coverFees.max}%
          </div>
        </div>
        <div>
          <Badge>APR: {apr}%</Badge>
        </div>
      </div>

      {/* Divider */}
      <hr className="mt-4 mb-8 border-t border-B0C4DB" />

      {/* Stats */}
      <div className="flex justify-between text-sm px-1">
        <span className="uppercase">utilization Ratio</span>
        <span className="font-semibold text-right">{utilizationRatio}%</span>
      </div>
      <div className="mt-2 mb-4">
        <ProgressBar value={utilizationRatio / 100} />
      </div>
      <div className="flex justify-between text-sm px-1">
        <span className="">Protection: ${amountFormatter(protection)}</span>
        {/* <span className="text-right">Liquidity: ${liquidity}M</span> */}
        <span className="text-right">
          Liquidity: ${amountFormatter(liquidity)}
        </span>
      </div>
    </OutlinedCard>
  );
};
