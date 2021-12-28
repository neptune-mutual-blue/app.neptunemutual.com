import { Badge } from "@/components/UI/atoms/badge";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { AmountToStakeModal } from "./amount-to-stake-modal";
import { useState } from "react";
import { CollectModal } from "@/components/UI/organisms/pools/staking/collect-modal";
import { amountFormatter } from "@/utils/formatter";

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

  const modalTitle = () => (
    <>
      <img
        src="/pools/staking/npm.png"
        alt="npm logo"
        className="inline-block mr-3"
      />
      Stake NPM
    </>
  );

  return (
    <OutlinedCard className="bg-white p-6" type="link">
      <div className="flex justify-between">
        <div>
          <div className="p-3 relative inline-block">
            <img
              src="/pools/staking/npm.png"
              alt="npm logo"
              className="inline-block "
            />
            <div className="absolute -top-1 -right-4">
              <div className="w-10 h-10 bg-DEEAF6 rounded-full relative">
                <img
                  src={imgSrc}
                  alt={name}
                  className="m-auto absolute top-0 bottom-0 right-0 left-0 "
                />
              </div>
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
            <RegularButton
              onClick={() => onOpen(id)}
              className={"text-white font-bold mt-6 mb-10 px-3 mr-1"}
            >
              +
            </RegularButton>
            <RegularButton
              onClick={() => collectModal(id)}
              className={"uppercase w-1/2 py-2 mt-6 mb-10"}
            >
              Collect
            </RegularButton>
          </>
        ) : (
          <RegularButton
            onClick={(e) => onOpen(id)}
            className={"uppercase w-full py-2 mt-6 mb-10"}
          >
            Stake
          </RegularButton>
        )}
      </div>
      <AmountToStakeModal
        id={id}
        lockingPeriod={lockingPeriod}
        modalTitle={modalTitle}
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
        modalTitle={modalTitle}
      />
    </OutlinedCard>
  );
};
