import * as Tooltip from "@radix-ui/react-tooltip";

import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import NeptuneMutualCircleLogo from "@/components/UI/atoms/logos/neptune-mutual-circle-logo";
import InfoCircleIcon from "@/icons/InfoCircleIcon";
import { BondStatsContainer } from "@/components/UI/molecules/pools/bond/BondStatsContainer";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { classNames } from "@/utils/classnames";
import { Badge } from "@/components/UI/atoms/badge";
import { isGreater } from "@/utils/bn";
import { explainInterval } from "@/utils/formatter/interval";
import { formatPercent } from "@/utils/formatter/percent";

export const BondInfoCard = ({
  roi,
  vestingPeriod,
  claimable,
  details,
  handleClaimModal,
}) => {
  return (
    <OutlinedCard className="bg-DEEAF6 p-10">
      <div className="flex justify-between items-start">
        <div>
          <NeptuneMutualCircleLogo />
          <h3 className="flex items-center text-h4 mt-1 font-sora font-semibold">
            <div>Bond Info</div>

            {/* Tooltip */}
            <Tooltip.Root>
              <Tooltip.Trigger className="block p-1">
                <span className="sr-only">Info</span>
                <InfoCircleIcon width={24} className="fill-9B9B9B" />
              </Tooltip.Trigger>

              <BondInfoTooltipContent vestingPeriod={vestingPeriod} />
            </Tooltip.Root>
          </h3>
        </div>

        <Badge className="text-21AD8C uppercase">
          ROI: {isNaN(roi) ? 0 : formatPercent(roi)}
        </Badge>
      </div>

      <p className="text-sm mt-2 mb-6 opacity-50">
        {explainInterval(vestingPeriod)} vesting term
      </p>

      <BondStatsContainer details={details} />

      {isGreater(claimable, "0") && (
        <OutlinedButton
          type="button"
          onClick={handleClaimModal}
          className={classNames(`block px-4 py-2 rounded-lg mt-10 mx-auto`)}
        >
          Claim My Bond
        </OutlinedButton>
      )}
    </OutlinedCard>
  );
};

const BondInfoTooltipContent = ({ vestingPeriod }) => {
  return (
    <>
      <Tooltip.Content side="top">
        <div className="text-sm leading-6 bg-black p-6 rounded-xl max-w-sm">
          <h3 className="font-sora font-bold text-EEEEEE">What is Bond?</h3>
          <p className="text-AABDCB mt-2">
            The bond feature provides you NPM tokens at a discounted value for a
            vesting period of {explainInterval(vestingPeriod)}.
          </p>
        </div>
        <Tooltip.Arrow offset={16} className="fill-black" />
      </Tooltip.Content>
    </>
  );
};
