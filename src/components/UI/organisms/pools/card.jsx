import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import NeptuneMutualCircleLogo from "@/components/UI/atoms/logos/neptune-mutual-circle-logo";
import InfoCircle from "@/icons/info-circle";
import { SplittedDetailsCards } from "@/components/UI/molecules/pools/bond/splitted-card-details";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { classNames } from "@/utils/classnames";
import { Badge } from "@/components/UI/atoms/badge";

export const BondsCard = ({
  ROI,
  vestingPeriod,
  details,
  showButton,
  handleClaimModal,
}) => {
  return (
    <OutlinedCard className="bg-DEEAF6 p-10">
      <div className="flex justify-between items-start">
        <div>
          <NeptuneMutualCircleLogo />
          <h3 className="flex align-middletext-h3 mt-1 font-sora font-semibold">
            Bond Info{" "}
            <InfoCircle className="fill-9B9B9B inline-flex ml-2 cursor-pointer" />
          </h3>
          <p className="text-sm mt-2 mb-6 opacity-50">
            {vestingPeriod} days vesting term
          </p>
        </div>
        <Badge>ROI: {ROI}%</Badge>
      </div>

      <SplittedDetailsCards details={details} />

      <OutlinedButton
        type="button"
        onClick={handleClaimModal}
        className={classNames(
          `block px-4 py-2 rounded-lg mt-10 mx-auto`,
          !showButton && "hidden"
        )}
      >
        Claim My Bond
      </OutlinedButton>
    </OutlinedCard>
  );
};
