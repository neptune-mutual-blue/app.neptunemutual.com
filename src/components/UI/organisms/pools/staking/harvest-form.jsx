import { RegularButton } from "@/components/UI/atoms/button/regular";
import { amountFormatter } from "@/utils/formatter";

export const HarvestForm = ({ onHarvest, stakedAmount, earned }) => {
  return (
    <div className="px-12">
      <div className="flex justify-between text-sm font-semibold px-1 mt-6">
        <span className="capitalize">Your Stake</span>
        <span className="text-right">You Earned</span>
      </div>
      <div className="flex justify-between text-sm px-1 pt-2">
        <span className="text-7398C0 uppercase">
          {amountFormatter(stakedAmount)} NPM
        </span>
        <span className="text-right text-7398C0 uppercase">{earned}</span>
      </div>

      <RegularButton
        onClick={onHarvest}
        className={"w-full mt-8 p-6 text-h6 uppercase font-semibold"}
      >
        Collect
      </RegularButton>
    </div>
  );
};
