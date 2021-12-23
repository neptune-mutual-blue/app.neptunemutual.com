import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import Link from "next/link";
import NeptuneMutualCircleLogo from "@/icons/neptune-mutual-circle-logo";
import InfoCircle from "@/icons/info-circle";
import { Label } from "@/components/UI/atoms/label";
import { mergeAlternatively } from "@/utils/arrays";
import { SplittedDetailsCards } from "@/components/UI/molecules/pools/bond/splitted-card-details";

export const BondsCard = ({ ROI, vestingPeriod, details }) => {
  return (
    <OutlinedCard className="bg-DEEAF6 p-10">
      <OutlinedCard className="w-fit border-21AD8C text-sm text-21AD8C py-1 px-3 font-semibold float-right">
        ROI: {ROI}%
      </OutlinedCard>
      <NeptuneMutualCircleLogo className="mt-4" />
      <h3 className="flex align-middletext-h3 mt-1 font-sora font-semibold">
        Bond Info <InfoCircle className="fill-9B9B9B inline-flex ml-2" />
      </h3>
      <p className="text-sm mt-2 mb-6 opacity-50">
        {vestingPeriod} days vesting term
      </p>

      <SplittedDetailsCards details={details} />
    </OutlinedCard>
  );
};
