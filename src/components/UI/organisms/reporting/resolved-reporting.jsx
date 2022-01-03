import { Divider } from "@/components/UI/atoms/divider";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { ProgressBar } from "@/components//UI/atoms/progress-bar";
import { amountFormatter } from "@/utils/formatter";
import { Badge } from "@/components/UI/atoms/badge";

export const ResolvedCard = ({ details }) => {
  const { name, imgSrc, resolvedOn, status } = details;
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
        </div>
        <div>
          {/* We are here setting status to true or false may be better option */}
          <Badge>{status}</Badge>
        </div>
      </div>

      {/* Divider */}
      <Divider />

      {/* Stats */}
      <div className="flex justify-between text-sm px-1">
        {/*  <span className="">Protection: ${amountFormatter(protection)}</span> */}
        {/* <span className="text-right">Liquidity: ${liquidity}M</span> */}
        <span className="text-right">
          {/* Liquidity: ${amountFormatter(liquidity)} */}
        </span>
      </div>
    </OutlinedCard>
  );
};
