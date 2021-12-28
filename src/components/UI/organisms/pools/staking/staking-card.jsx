import { Badge } from "@/components/UI/atoms/badge";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { AmountToStakeModal } from "./amount-to-stake-modal";
import { useState } from "react";
import { CollectModal } from "@/components/UI/organisms/pools/staking/collect-modal";
import { amountFormatter } from "@/utils/formatter";
import AddIcon from "@/icons/add";

export const StakingCard = ({
  id,
  details,
  children,
  staked,
  onStake,
  earnPercent,
}) => {
  const { name, imgSrc, apr, lockingPeriod, tvl } = details;
  const [isOpen, setIsOpen] = useState(false);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);

  function onClose() {
    setIsOpen(false);
  }
  function onCollectModalClose() {
    setIsCollectModalOpen(false);
  }
  function onCollectModalOpen() {
    setIsCollectModalOpen(true);
  }

  function onOpen(_id) {
    setIsOpen(true);
  }

  const collectModal = (_id) => {
    console.log("collect clicked", _id);
    onCollectModalOpen();
  };

  let stakedOne = staked.find((s) => s?.id == id);

  return (
    <OutlinedCard className="bg-white px-6 pt-6 pb-10">
      <div className="flex justify-between">
        <div>
          <div className="p-3 relative inline-block">
            <div className="border border-black rounded-full w-10 h-10 flex justify-center items-center">
              <img
                src="/pools/staking/npm.png"
                alt="npm logo"
                className="inline-block "
              />
            </div>
            <div className="absolute -top-1 -right-4 bg-DEEAF6 border border-white rounded-full w-10 h-10 flex justify-center items-center">
              <img src={imgSrc} alt={name} />
            </div>
          </div>
          <h4 className="text-h4 font-sora font-semibold  mt-4">
            Earn <span className="uppercase">{name}</span>
          </h4>
          <div className="text-sm text-7398C0 uppercase mt-2">Stake NPM</div>
        </div>
        <div>
          <Badge>APR: {apr}%</Badge>
        </div>
      </div>

      {/* Divider */}
      <hr className="mt-4 mb-8 border-t border-B0C4DB" />

      {/* Stats */}
      <div className="flex justify-between text-sm font-semibold px-1">
        <span className="capitalize">
          {!stakedOne?.id ? "locking period" : "Your stake"}
        </span>
        <span className="text-right">TVL</span>
      </div>
      <div className="flex justify-between text-sm px-1 pt-2">
        <span className="text-7398C0">
          {!stakedOne?.id
            ? `${lockingPeriod} hours`
            : `${amountFormatter(stakedOne?.stakedAmt)} NPM`}
        </span>
        <span className="text-right text-7398C0">$ {tvl}</span>
      </div>
      <div className="flex">
        {stakedOne?.id ? (
          <>
            <div className="w-full mt-6">
              <div className="flex justify-between text-sm font-semibold px-1">
                <span className="capitalize">You Earned</span>
              </div>
              <div className="flex justify-between text-sm px-1 pt-2">
                <span className="text-7398C0 uppercase">
                  {earnPercent * stakedOne?.stakedAmt} {name}
                </span>
              </div>
            </div>
            <div className="flex self-baseline">
              <RegularButton
                onClick={() => onOpen(id)}
                className={"text-white px-2 mt-6 mr-2"}
              >
                <AddIcon width={16} fill="currentColor" />
              </RegularButton>
              <RegularButton
                onClick={() => collectModal(id)}
                className={"font-semibold uppercase text-sm px-5 py-2 mt-6"}
              >
                Collect
              </RegularButton>
            </div>
          </>
        ) : (
          <RegularButton
            onClick={(e) => onOpen(id)}
            className={"w-full font-semibold uppercase text-sm py-2 mt-6"}
          >
            Stake
          </RegularButton>
        )}
      </div>
      <AmountToStakeModal
        id={id}
        lockingPeriod={lockingPeriod}
        modalTitle={
          <>
            <img
              src="/pools/staking/npm.png"
              alt="npm logo"
              className="inline-block mr-3 w-10 h-10"
            />
            Stake NPM
          </>
        }
        onClose={onClose}
        isOpen={isOpen}
        onStake={onStake}
      />
      <CollectModal
        id={id}
        stakedAmount={stakedOne?.stakedAmt}
        earned={`${earnPercent * stakedOne?.stakedAmt} ${name}`}
        isCollectModalOpen={isCollectModalOpen}
        onCollectModalClose={onCollectModalClose}
        modalTitle={
          <>
            <img
              src="/pools/staking/npm.png"
              alt="npm logo"
              className="inline-block mr-3  w-10 h-10"
            />
            Collect NPM
          </>
        }
      />
    </OutlinedCard>
  );
};
