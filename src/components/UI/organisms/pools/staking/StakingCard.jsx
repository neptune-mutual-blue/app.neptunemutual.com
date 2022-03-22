import { useState } from "react";
import { CollectRewardModal } from "@/components/UI/organisms/pools/staking/CollectRewardModal";
import AddIcon from "@/icons/AddIcon";
import { DoubleImage } from "@/components/common/DoubleImage";
import { StakingCardTitle } from "@/components/UI/molecules/pools/staking/StakingCardTitle";
import { StakingCardSubTitle } from "@/components/UI/molecules/pools/staking/StakingCardSubTitle";
import { StakingCardCTA } from "@/components/UI/molecules/pools/staking/StakingCardCTA";
import { StakeModal } from "@/components/UI/organisms/pools/staking/StakeModal";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import BigNumber from "bignumber.js";
import { mergeAlternatively } from "@/utils/arrays";
import { getTokenImgSrc } from "@/src/helpers/token";
import { PoolCardStat } from "@/components/UI/molecules/pools/staking/PoolCardStat";
import { classNames } from "@/utils/classnames";
import { usePoolInfo } from "@/src/hooks/usePoolInfo";
import { convertFromUnits, isGreater } from "@/utils/bn";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { config } from "@neptunemutual/sdk";
import { useNetwork } from "@/src/context/Network";
import { explainInterval } from "@/utils/formatter/interval";
import { formatCurrency } from "@/utils/formatter/currency";
import { formatPercent } from "@/utils/formatter/percent";
import { Badge } from "@/components/UI/atoms/badge";
import { MULTIPLIER } from "@/src/config/constants";

// data from subgraph
// info from `getInfo` on smart contract
// Both data and info may contain common data
export const StakingCard = ({ data, tvl }) => {
  const { networkId } = useNetwork();
  const { info, refetch: refetchInfo } = usePoolInfo({ key: data.key });

  const rewardTokenAddress = info.rewardToken;
  const stakingTokenSymbol = useTokenSymbol(info.stakingToken);
  const rewardTokenSymbol = useTokenSymbol(info.rewardToken);

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

  const poolKey = data.key;
  const stakedAmount = info.myStake;
  const rewardAmount = info.rewards;

  const hasStaked = isGreater(info.myStake, "0");
  const approxBlockTime =
    config.networks.getChainConfig(networkId).approximateBlockTime;
  const lockupPeriod = BigNumber(data.lockupPeriodInBlocks).multipliedBy(
    approxBlockTime
  );
  const imgSrc = getTokenImgSrc(rewardTokenSymbol);
  const npmImgSrc = getTokenImgSrc(stakingTokenSymbol);
  const poolName = info.name;

  const leftHalf = [];

  if (hasStaked) {
    leftHalf.push({
      title: "Your Stake",
      value: formatCurrency(
        convertFromUnits(stakedAmount),
        stakingTokenSymbol,
        true
      ).long,
    });
  } else {
    leftHalf.push({
      title: "Lockup Period",
      value: `${explainInterval(data.lockupPeriodInBlocks * approxBlockTime)}`,
    });
  }

  const rightHalf = [
    {
      title: "TVL",
      value: formatCurrency(convertFromUnits(tvl), "USD").short,
      tooltip: formatCurrency(convertFromUnits(tvl), "USD").long,
    },
  ];

  const stats = mergeAlternatively(leftHalf, rightHalf, {
    title: "",
    value: "",
    tooltip: "",
  });

  if (info.name === "") {
    return null;
  }

  const stakeModalTitle = (
    <div className="flex items-center">
      <div className="mr-8">
        <DoubleImage
          images={[
            { src: npmImgSrc, alt: "NPM" },
            { src: imgSrc, alt: rewardTokenSymbol },
          ]}
        />
      </div>

      <h3>Earn {rewardTokenSymbol}</h3>
    </div>
  );

  const collectModalTitle = (
    <div className="flex items-center">
      <div className="mr-8">
        <DoubleImage
          images={[
            { src: npmImgSrc, alt: "NPM" },
            { src: imgSrc, alt: rewardTokenSymbol },
          ]}
        />
      </div>

      <h3>Earn {rewardTokenSymbol}</h3>
    </div>
  );

  return (
    <OutlinedCard className="px-6 pt-6 pb-10 bg-white">
      <div className="flex justify-between">
        <div>
          <DoubleImage
            images={[
              { src: npmImgSrc, alt: stakingTokenSymbol },
              { src: imgSrc, alt: name },
            ]}
          />
          <StakingCardTitle text={poolName} />
          <StakingCardSubTitle text={"Stake " + stakingTokenSymbol} />
        </div>
        <div>
          <Badge className="text-21AD8C">
            APR: {formatPercent(info.apr / MULTIPLIER)}
          </Badge>
        </div>
      </div>

      <hr className="mt-4 border-t border-B0C4DB" />

      <div className="flex flex-wrap justify-between px-1 text-sm">
        {stats.map((x, idx) => {
          return (
            <div key={x.title} className="flex flex-col w-1/2 mt-5">
              <div
                className={classNames(idx % 2 && "text-right")}
                title={x.tooltip}
              >
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
              <PoolCardStat
                title="You Earned"
                value={
                  formatCurrency(
                    convertFromUnits(rewardAmount),
                    rewardTokenSymbol,
                    true
                  ).short
                }
                tooltip={
                  formatCurrency(
                    convertFromUnits(rewardAmount),
                    rewardTokenSymbol,
                    true
                  ).long
                }
              />
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
        poolKey={poolKey}
        info={info}
        refetchInfo={refetchInfo}
        lockupPeriod={lockupPeriod}
        isOpen={isStakeModalOpen}
        onClose={onStakeModalClose}
        stakingTokenSymbol={stakingTokenSymbol}
        modalTitle={stakeModalTitle}
      />
      <CollectRewardModal
        poolKey={poolKey}
        info={info}
        refetchInfo={refetchInfo}
        stakedAmount={stakedAmount}
        rewardAmount={rewardAmount}
        rewardTokenAddress={rewardTokenAddress}
        rewardTokenSymbol={rewardTokenSymbol}
        stakingTokenSymbol={stakingTokenSymbol}
        isOpen={isCollectModalOpen}
        onClose={onCollectModalClose}
        modalTitle={collectModalTitle}
      />
    </OutlinedCard>
  );
};
