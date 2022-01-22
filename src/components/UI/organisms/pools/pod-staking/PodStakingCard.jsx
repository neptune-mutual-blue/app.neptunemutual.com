import { useState } from "react";
import { CollectModal } from "@/components/UI/organisms/pools/staking/collect-modal";
import AddIcon from "@/icons/AddIcon";
import { SingleImage } from "@/components/UI/molecules/pools/staking/SingleImage";
import { StakingCardTitle } from "@/components/UI/molecules/pools/staking/StakingCardTitle";
import { StakingCardSubTitle } from "@/components/UI/molecules/pools/staking/StakingCardSubTitle";
import { StakingCardCTA } from "@/components/UI/molecules/pools/staking/StakingCardCTA";
import { ModalTitle } from "@/components/UI/molecules/modal/ModalTitle";
import { Badge } from "@/components/UI/atoms/badge";
import { AmountToStakeModal } from "@/components/UI/organisms/pools/staking/AmountToStakeModal";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import BigNumber from "bignumber.js";
import { mergeAlternatively } from "@/utils/arrays";
import { getTokenImgSrc } from "@/src/helpers/token";
import { PoolCardStat } from "@/components/UI/molecules/pools/staking/PoolCardStat";
import { classNames } from "@/utils/classnames";

export const PodStakingCard = (props) => {
  const { info, onStake, hasStaked } = props;

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
    onCollectModalOpen();
  };

  const tokenSymbol = info.name.replace(" Staking", "").toUpperCase();
  const lockupPeriod = BigNumber(info.lockupPeriod)
    .dividedBy("3600")
    .toString(); // hours
  const imgSrc = getTokenImgSrc(info.key);

  console.log("info", info);

  const leftHalf = [
    {
      title: "Locking Period",
      value: `${lockupPeriod} hours`,
    },
    {
      title: "Your Stake",
      value: `25 ${tokenSymbol}-POD`,
    },
  ];

  const rightHalf = [
    {
      title: "TVL",
      value: `$ 25.0M`,
    },
  ];

  const stats = mergeAlternatively(leftHalf, rightHalf, {
    title: "",
    value: "",
  });

  return (
    <OutlinedCard className="bg-white px-6 pt-6 pb-10">
      <div className="flex justify-between">
        <div>
          <SingleImage src={imgSrc} alt={tokenSymbol}></SingleImage>
          <StakingCardTitle name={tokenSymbol} />
          <StakingCardSubTitle unitName={`${tokenSymbol}-POD`} />
        </div>
        <div>
          <Badge>APR: {25}%</Badge>
        </div>
      </div>

      <hr className="mt-4 border-t border-B0C4DB" />

      <div className="flex flex-wrap justify-between text-sm  px-1">
        {stats.map((x, idx) => {
          return (
            <div key={x.title} className="flex flex-col w-1/2 mt-5">
              <div className={classNames(idx % 2 && "text-right")}>
                <PoolCardStat title={x.title} value={x.value} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center mt-5">
        {hasStaked ? (
          <>
            <div className="flex-1 text-sm">
              <PoolCardStat title={x.title} value={x.value} />
            </div>
            <div className="flex items-center">
              <StakingCardCTA
                className={"text-white px-2 mr-2"}
                onClick={onOpen}
              >
                <AddIcon width={16} fill="currentColor" />
              </StakingCardCTA>
              <StakingCardCTA
                className={"font-semibold uppercase text-sm px-5 py-2"}
                onClick={collectModal}
              >
                Collect
              </StakingCardCTA>
            </div>
          </>
        ) : (
          <StakingCardCTA onClick={onOpen}>Stake</StakingCardCTA>
        )}
      </div>
      <AmountToStakeModal
        modalTitle={
          <ModalTitle imgSrc={imgSrc}>Stake {`${tokenSymbol}-POD`}</ModalTitle>
        }
        onClose={onClose}
        isOpen={isOpen}
        onStake={onStake}
        unitName={`${tokenSymbol}-POD`}
      />
      <CollectModal
        stakedAmount={"150000"}
        earned={`150000 ${tokenSymbol}`}
        isCollectModalOpen={isCollectModalOpen}
        onCollectModalClose={onCollectModalClose}
        modalTitle={
          <ModalTitle imgSrc={imgSrc}>
            Collect {`${tokenSymbol}-POD`}
          </ModalTitle>
        }
        unitName={`${tokenSymbol}-POD`}
      />
    </OutlinedCard>
  );
};
