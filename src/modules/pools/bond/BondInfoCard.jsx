import * as Tooltip from "@radix-ui/react-tooltip";

import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import InfoCircleIcon from "@/icons/InfoCircleIcon";
import { BondStatsContainer } from "@/components/UI/molecules/pools/bond/BondStatsContainer";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { classNames } from "@/utils/classnames";
import { Badge } from "@/components/UI/atoms/badge";
import { isGreater } from "@/utils/bn";
import { explainInterval } from "@/utils/formatter/interval";
import { formatPercent } from "@/utils/formatter/percent";
import { ClaimBondModal } from "@/src/modules/pools/bond/ClaimBondModal";
import { useState } from "react";

export const BondInfoCard = ({ roi, info, details, refetchBondInfo }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <OutlinedCard className="p-10 bg-DEEAF6">
      <div className="flex items-start justify-between">
        <div>
          <img
            src="/images/tokens/npm.svg"
            alt="NPM Logo"
            className="w-10 h-10"
          />
          <h3 className="flex items-center mt-1 font-semibold text-h4 font-sora">
            <div>Bond Info</div>

            {/* Tooltip */}
            <Tooltip.Root>
              <Tooltip.Trigger className="block p-1">
                <span className="sr-only">Info</span>
                <InfoCircleIcon width={24} className="fill-9B9B9B" />
              </Tooltip.Trigger>

              <BondInfoTooltipContent vestingPeriod={info.vestingTerm} />
            </Tooltip.Root>
          </h3>
        </div>

        <Badge className="uppercase text-21AD8C">
          ROI: {formatPercent(roi)}
        </Badge>
      </div>

      <p className="mt-2 mb-6 text-sm opacity-50">
        {explainInterval(info.vestingTerm)} vesting term
      </p>

      <BondStatsContainer details={details} />

      {isGreater(info.claimable, "0") && (
        <>
          <OutlinedButton
            type="button"
            onClick={onOpen}
            className={classNames(`block px-4 py-2 rounded-lg mt-10 mx-auto`)}
          >
            Claim My Bond
          </OutlinedButton>

          <ClaimBondModal
            isOpen={isOpen}
            onClose={onClose}
            modalTitle={"Claim Bond"}
            unlockDate={info.unlockDate}
            claimable={info.claimable}
            refetchBondInfo={refetchBondInfo}
          />
        </>
      )}
    </OutlinedCard>
  );
};

const BondInfoTooltipContent = ({ vestingPeriod }) => {
  return (
    <>
      <Tooltip.Content side="top">
        <div className="max-w-sm p-6 text-sm leading-6 bg-black rounded-xl">
          <h3 className="font-bold font-sora text-EEEEEE">What is Bond?</h3>
          <p className="mt-2 text-AABDCB">
            The bond feature provides you NPM tokens at a discounted value for a
            vesting period of {explainInterval(vestingPeriod)}.
          </p>
        </div>
        <Tooltip.Arrow offset={16} className="fill-black" />
      </Tooltip.Content>
    </>
  );
};
