import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { Badge } from "@/components/UI/atoms/badge";
import { Divider } from "@/components/UI/atoms/divider";
import { ProgressBar } from "@/components/UI/atoms/progress-bar";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { convertFromUnits } from "@/utils/bn";
import { formatWithAabbreviation } from "@/utils/formatter";

export const CoverCard = ({ coverKey, totalPODs }) => {
  const { coverInfo } = useCoverInfo(coverKey);

  if (!coverInfo) {
    return null;
  }

  const imgSrc = getCoverImgSrc({ key: coverKey });

  return (
    <OutlinedCard className="bg-white p-6" type="link">
      <div className="flex justify-between">
        <div>
          <div className="w-18 h-18 bg-DEEAF6 p-3 rounded-full">
            <img
              src={imgSrc}
              alt={coverInfo.projectName}
              className="inline-block max-w-full"
            />
          </div>
          <h4 className="text-h4 font-sora font-semibold uppercase mt-4">
            {coverInfo.projectName}
          </h4>
        </div>
        <div>
          <Badge>APR: {"25"}%</Badge>
        </div>
      </div>

      {/* Divider */}
      <Divider />

      {/* Stats */}
      <div className="flex justify-between text-sm px-1">
        <span className="uppercase">Reassurance Ratio</span>
        <span className="font-semibold text-right">{25}%</span>
      </div>
      <div className="mt-2 mb-4">
        <ProgressBar value={25 / 100} />
      </div>
      <div className="flex justify-between text-sm px-1">
        <span className="">
          My Liquidity:{" "}
          {formatWithAabbreviation(convertFromUnits(totalPODs || "0"))} POD
        </span>
      </div>
    </OutlinedCard>
  );
};
