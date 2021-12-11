import { Badge } from "@/components/common/badge";
import { ProgressBar } from "@/components/common/progress-bar";
import { OutlinedCard } from "@/components/common/outlined-card";
import { ImageContainer } from "@/components/common/image-container";

export const CoverCard = ({ children }) => {
  const title = "Clearpool";
  return (
    <OutlinedCard className="bg-white-bg p-6" type="link">
      <div className="flex justify-between">
        <div>
          <ImageContainer className="bg-ash-brand p-3">
            <img
              src="/covers/clearpool.png"
              alt={title}
              className="inline-block max-w-full"
            />
          </ImageContainer>
          <h4 className="text-h4 font-sora font-semibold uppercase mt-4">
            {title}
          </h4>
          <div className="text-sm text-dimmed-card uppercase mt-2">
            cover fee: 5-7%
          </div>
        </div>
        <div>
          <Badge>APR: 12.03%</Badge>
        </div>
      </div>

      {/* Divider */}
      <hr className="mt-4 mb-8 border-t border-ash-border" />

      {/* Stats */}
      <div className="flex justify-between text-sm px-1">
        <span className="uppercase">utilization Ratio</span>
        <span className="font-semibold text-right">65%</span>
      </div>
      <div className="mt-2 mb-4">
        <ProgressBar value={0.4} />
      </div>
      <div className="flex justify-between text-sm px-1">
        <span className="">Protection: $800 K</span>
        <span className="text-right">Liquidity: $11.01M</span>
      </div>
    </OutlinedCard>
  );
};
