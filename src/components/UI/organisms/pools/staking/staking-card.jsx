import { Badge } from "@/components/UI/atoms/badge";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { AmountToStakeModal } from "./amount-to-stake-modal";
import { useState } from "react";
import { CollectModal } from "@/components/UI/organisms/pools/staking/collect-modal";
import AddIcon from "@/icons/add";
import { Divider } from "@/components/UI/atoms/divider";
import { ImageContainer } from "@/components/UI/molecules/pools/staking/imageContainer";
import { StakingCardTitle } from "@/components/UI/molecules/pools/staking/staking-card-title";
import { StakingCardSubTitle } from "@/components/UI/molecules/pools/staking/staking-card-subtitle";
import { Stat } from "@/components/UI/molecules/pools/staking/stat";
import { StatTitle } from "@/components/UI/molecules/pools/staking/stat-title";
import { StatDescription } from "@/components/UI/molecules/pools/staking/stat-description";
import { StakingCardCTA } from "@/components/UI/molecules/pools/staking/staking-card-cta";
import { ModalTitle } from "@/components/UI/molecules/pools/staking/modal-title";

export const StakingCard = ({
  id,
  details,
  children,
  staked,
  onStake,
  earnPercent,
  fromPage,
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

  let unitName =
    fromPage === "podstaking" ? `${name.toUpperCase()}-POD` : " NPM";
  return (
    <OutlinedCard className="bg-white px-6 pt-6 pb-10">
      <div className="flex justify-between">
        <div>
          <div className="p-3 relative inline-block">
            {fromPage === "podstaking" ? (
              <ImageContainer
                doubleImage={false}
                imgSrc={imgSrc}
                name={name}
              ></ImageContainer>
            ) : (
              <ImageContainer imgSrc={imgSrc} name={name} />
            )}
          </div>
          <StakingCardTitle name={name} />
          <StakingCardSubTitle unitName={unitName} />
        </div>
        <div>
          <Badge>APR: {apr}%</Badge>
        </div>
      </div>

      <Divider />

      <div className="flex justify-between text-sm  px-1">
        <Stat position={"left"}>
          <StatTitle stakedOne={stakedOne} />
          <StatDescription
            stakedOne={stakedOne}
            lockingPeriod={lockingPeriod}
          />
        </Stat>
        <Stat position={"right"}>
          <StatTitle>TVL</StatTitle>
          <StatDescription>$ {tvl}</StatDescription>
        </Stat>
      </div>
      <div className="flex">
        {stakedOne?.id ? (
          <>
            <Stat className={"w-full self-end text-sm px-1"} position={"left"}>
              <StatTitle>You Earned</StatTitle>
              <StatDescription>
                {earnPercent * stakedOne?.stakedAmt} {name}
              </StatDescription>
            </Stat>
            <div className="flex self-baseline">
              <StakingCardCTA
                className={"text-white px-2 mt-6 mr-2"}
                onClick={() => onOpen(id)}
              >
                <AddIcon width={16} fill="currentColor" />
              </StakingCardCTA>
              <StakingCardCTA
                className={"font-semibold uppercase text-sm px-5 py-2 mt-6"}
                onClick={() => collectModal(id)}
              >
                Collect
              </StakingCardCTA>
            </div>
          </>
        ) : (
          <StakingCardCTA onClick={() => onOpen(id)}>Stake</StakingCardCTA>
        )}
      </div>
      <AmountToStakeModal
        id={id}
        lockingPeriod={lockingPeriod}
        modalTitle={
          <ModalTitle fromPage={fromPage} imgSrc={imgSrc}>
            Stake {unitName}
          </ModalTitle>
        }
        onClose={onClose}
        isOpen={isOpen}
        onStake={onStake}
        unitName={unitName}
      />
      <CollectModal
        id={id}
        stakedAmount={stakedOne?.stakedAmt}
        earned={`${earnPercent * stakedOne?.stakedAmt} ${name}`}
        isCollectModalOpen={isCollectModalOpen}
        onCollectModalClose={onCollectModalClose}
        modalTitle={
          <ModalTitle fromPage={fromPage} imgSrc={imgSrc}>
            Collect {unitName}
          </ModalTitle>
        }
        unitName={unitName}
      />
    </OutlinedCard>
  );
};
