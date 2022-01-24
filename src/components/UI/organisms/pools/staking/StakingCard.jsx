import { useState } from "react";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { CollectModal } from "@/components/UI/organisms/pools/staking/collect-modal";
import AddIcon from "@/icons/AddIcon";
import { StakingCardTitle } from "@/components/UI/molecules/pools/staking/StakingCardTitle";
import { StakingCardSubTitle } from "@/components/UI/molecules/pools/staking/StakingCardSubTitle";
import { StakingCardCTA } from "@/components/UI/molecules/pools/staking/StakingCardCTA";
import { ModalTitle } from "@/components/UI/molecules/modal/ModalTitle";
import { Badge } from "@/components/UI/atoms/badge";
import { StakeModal } from "@/components/UI/organisms/pools/staking/StakeModal";
import { PoolCardStat } from "@/components/UI/molecules/pools/staking/PoolCardStat";
import { getTokenImgSrc } from "@/src/helpers/token";
import BigNumber from "bignumber.js";
import { mergeAlternatively } from "@/utils/arrays";
import { classNames } from "@/utils/classnames";
import { DoubleImage } from "@/components/UI/molecules/pools/staking/DoubleImage";

export const StakingCard = (props) => {
  const { name, apr, onStake, hasStaked } = props;

  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);

  function onStakeModalOpen() {
    setIsStakeModalOpen(true);
  }
  function onStakeModalClose() {
    setIsStakeModalOpen(false);
  }

  function onCollectModalClose() {
    setIsCollectModalOpen(false);
  }
  function onCollectModalOpen() {
    setIsCollectModalOpen(true);
  }

  const tokenSymbol = "CPOOL";
  const stakingTokenSymbol = "NPM";
  const lockupPeriod = BigNumber("43200").dividedBy("3600").toString(); // hours
  const imgSrc = getTokenImgSrc("test");
  const npmImgSrc = "/pools/staking/npm.png";

  const leftHalf = [];

  if (hasStaked) {
    leftHalf.push({
      title: "Your Stake",
      value: `25 NPM`,
    });
  } else {
    leftHalf.push({
      title: "Locking Period",
      value: `${lockupPeriod} hours`,
    });
  }

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
          <DoubleImage
            images={[
              { src: "/pools/staking/npm.png", alt: "NPM" },
              { src: imgSrc, alt: name },
            ]}
          />
          <StakingCardTitle name={name} />
          <StakingCardSubTitle unitName={" NPM"} />
        </div>
        <div>
          <Badge>APR: {apr}%</Badge>
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
              <PoolCardStat title="You Earned" value={`25 ${tokenSymbol}`} />
            </div>
            <div className="flex items-center">
              <StakingCardCTA
                className={"text-white px-2 mr-2"}
                onClick={onStakeModalOpen}
              >
                <AddIcon width={16} fill="currentColor" />
              </StakingCardCTA>
              <StakingCardCTA
                className={"font-semibold uppercase text-sm px-5 py-2"}
                onClick={onCollectModalOpen}
              >
                Collect
              </StakingCardCTA>
            </div>
          </>
        ) : (
          <StakingCardCTA onClick={onStakeModalOpen}>Stake</StakingCardCTA>
        )}
      </div>
      <StakeModal
        poolKey={"poolKey"}
        info={{
          stakingToken: "0x",
          lockupPeriod: "86400",
          maximumStake: "10000000000000",
        }}
        modalTitle={
          <ModalTitle imgSrc={imgSrc}>Stake {stakingTokenSymbol}</ModalTitle>
        }
        onClose={onStakeModalClose}
        isOpen={isStakeModalOpen}
        unitName={stakingTokenSymbol}
      />
      <CollectModal
        stakedAmount={"150000"}
        earned={`150000 ${tokenSymbol}`}
        isCollectModalOpen={isCollectModalOpen}
        onCollectModalClose={onCollectModalClose}
        modalTitle={
          <ModalTitle imgSrc={npmImgSrc}>Collect {" NPM"}</ModalTitle>
        }
        unitName={" NPM"}
      />
    </OutlinedCard>
  );
};
