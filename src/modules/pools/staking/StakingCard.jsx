import { useState, useEffect } from "react";
import { CollectRewardModal } from "@/src/modules/pools/staking/CollectRewardModal";
import AddIcon from "@/icons/AddIcon";
import { DoubleImage } from "@/common/DoubleImage";
import { StakingCardTitle } from "@/src/modules/pools/staking/StakingCardTitle";
import { StakingCardSubTitle } from "@/src/modules/pools/staking/StakingCardSubTitle";
import { StakingCardCTA } from "@/src/modules/pools/staking/StakingCardCTA";
import { StakeModal } from "@/src/modules/pools/staking/StakeModal";
import { OutlinedCard } from "@/common/OutlinedCard/OutlinedCard";
import { mergeAlternatively } from "@/utils/arrays";
import { getTokenImgSrc } from "@/src/helpers/token";
import { PoolCardStat } from "@/src/modules/pools/staking/PoolCardStat";
import { classNames } from "@/utils/classnames";
import { usePoolInfo } from "@/src/hooks/usePoolInfo";
import { convertFromUnits, isGreater, toBN } from "@/utils/bn";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { config } from "@neptunemutual/sdk";
import { useNetwork } from "@/src/context/Network";
import { explainInterval } from "@/utils/formatter/interval";
import { formatCurrency } from "@/utils/formatter/currency";
import { formatPercent } from "@/utils/formatter/percent";
import { Badge } from "@/common/Badge/Badge";
import { PoolTypes } from "@/src/config/constants";
import { getApr } from "@/src/services/protocol/staking-pool/info/apr";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { useStakingPoolsStats } from "@/modules/pools/staking/StakingPoolsStatsContext";

// data from subgraph
// info from `getInfo` on smart contract
// Both data and info may contain common data
export const StakingCard = ({ data, tvl, getPriceByAddress }) => {
  const { setStatsByKey } = useStakingPoolsStats();
  const { networkId } = useNetwork();
  const { info, refetch: refetchInfo } = usePoolInfo({
    key: data.key,
    type: PoolTypes.TOKEN,
  });

  const rewardTokenAddress = info.rewardToken;
  const stakingTokenSymbol = useTokenSymbol(info.stakingToken);
  const rewardTokenSymbol = useTokenSymbol(info.rewardToken);

  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const router = useRouter();

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
  const lockupPeriod = toBN(data.lockupPeriodInBlocks).multipliedBy(
    approxBlockTime
  );
  const rTokenImgSrc = getTokenImgSrc(rewardTokenSymbol);
  const sTokenImgSrc = getTokenImgSrc(stakingTokenSymbol);
  const poolName = info.name;

  const apr = getApr(networkId, {
    stakingTokenPrice: getPriceByAddress(info.stakingToken),
    rewardPerBlock: info.rewardPerBlock,
    rewardTokenPrice: getPriceByAddress(info.rewardToken),
  });

  // Used for sorting purpose only
  useEffect(() => {
    setStatsByKey(poolKey, { apr });
  }, [apr, poolKey, setStatsByKey]);

  const leftHalf = [];

  if (hasStaked) {
    leftHalf.push({
      title: t`Your Stake`,
      value: formatCurrency(
        convertFromUnits(stakedAmount),
        router.locale,
        stakingTokenSymbol,
        true
      ).long,
    });
  } else {
    leftHalf.push({
      title: t`Lockup Period`,
      value: `${explainInterval(data.lockupPeriodInBlocks * approxBlockTime)}`,
    });
  }

  const rightHalf = [
    {
      title: t`TVL`,
      value: formatCurrency(convertFromUnits(tvl), router.locale, "USD").short,
      tooltip: formatCurrency(convertFromUnits(tvl), router.locale, "USD").long,
    },
  ];

  const stats = mergeAlternatively(leftHalf, rightHalf, {
    title: "",
    value: "",
    tooltip: "",
  });

  if (info.name === "") {
    return <CardSkeleton numberOfCards={1} />;
  }

  const stakeModalTitle = (
    <div className="flex items-center">
      <div className="mr-8">
        <DoubleImage
          images={[
            { src: sTokenImgSrc, alt: stakingTokenSymbol },
            { src: rTokenImgSrc, alt: rewardTokenSymbol },
          ]}
        />
      </div>

      <h3>
        <Trans>Earn</Trans> {rewardTokenSymbol}
      </h3>
    </div>
  );

  const collectModalTitle = (
    <div className="flex items-center">
      <div className="mr-8">
        <DoubleImage
          images={[
            { src: sTokenImgSrc, alt: stakingTokenSymbol },
            { src: rTokenImgSrc, alt: rewardTokenSymbol },
          ]}
        />
      </div>

      <h3>Earn {rewardTokenSymbol}</h3>
    </div>
  );

  return (
    <OutlinedCard className="px-6 pt-6 pb-10 bg-white">
      <div className="flex items-start justify-between">
        <div>
          <DoubleImage
            images={[
              { src: sTokenImgSrc, alt: stakingTokenSymbol },
              { src: rTokenImgSrc, alt: rewardTokenSymbol },
            ]}
          />
        </div>

        <Badge className="text-21AD8C">
          <Trans>APR:</Trans> {formatPercent(apr, router.locale)}
        </Badge>
      </div>
      <StakingCardTitle text={poolName} />
      <StakingCardSubTitle text={t`Stake` + " " + stakingTokenSymbol} />

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
                title={t`You Earned`}
                value={
                  formatCurrency(
                    convertFromUnits(rewardAmount),
                    router.locale,
                    rewardTokenSymbol,
                    true
                  ).short
                }
                tooltip={
                  formatCurrency(
                    convertFromUnits(rewardAmount),
                    router.locale,
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
                <Trans>Collect</Trans>
              </StakingCardCTA>
            </div>
          </>
        ) : (
          <StakingCardCTA onClick={onStakeModalOpen}>
            <Trans>Stake</Trans>
          </StakingCardCTA>
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
