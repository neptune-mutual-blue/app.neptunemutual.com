import { useState, useEffect } from 'react'
import { CollectRewardModal } from '@/src/modules/pools/staking/CollectRewardModal'
import AddIcon from '@/icons/AddIcon'
import { DoubleImage } from '@/common/DoubleImage'
import { StakingCardTitle } from '@/src/modules/pools/staking/StakingCardTitle'
import { StakingCardSubTitle } from '@/src/modules/pools/staking/StakingCardSubTitle'
import { StakingCardCTA } from '@/src/modules/pools/staking/StakingCardCTA'
import { StakeModal } from '@/src/modules/pools/staking/StakeModal'
import { OutlinedCard } from '@/common/OutlinedCard/OutlinedCard'
import { getTokenImgSrc } from '@/src/helpers/token'
import { PoolCardStat } from '@/modules/pools/staking/PoolCardStat'
import { usePoolInfo } from '@/src/hooks/usePoolInfo'
import { convertFromUnits, isGreater, toBN } from '@/utils/bn'
import { config } from '@neptunemutual/sdk'
import { useNetwork } from '@/src/context/Network'
import { explainInterval } from '@/utils/formatter/interval'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { Badge } from '@/common/Badge/Badge'
import { PoolTypes } from '@/src/config/constants'
import { getApr } from '@/src/services/protocol/staking-pool/info/apr'
import { t, Trans } from '@lingui/macro'
import { useRouter } from 'next/router'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import { useSortableStats } from '@/src/context/SortableStatsContext'
import { useAppConstants } from '@/src/context/AppConstants'
import { logStakingPoolCollectPopupToggled, logStakingPoolDepositPopupToggled } from '@/src/services/logs'
import { useWeb3React } from '@web3-react/core'
import { analyticsLogger } from '@/utils/logger'

// data from subgraph
// info from `getInfo` on smart contract
// Both data and info may contain common data
export const StakingCard = ({ data, tvl, getPriceByAddress }) => {
  const { account } = useWeb3React()
  const { setStatsByKey } = useSortableStats()
  const { liquidityTokenDecimals } = useAppConstants()
  const { networkId } = useNetwork()
  const { info, refetch: refetchInfo } = usePoolInfo({
    key: data.key,
    type: PoolTypes.TOKEN
  })

  const rewardTokenAddress = info.rewardToken
  const stakingTokenSymbol = data.stakingTokenSymbol
  const rewardTokenSymbol = data.rewardTokenSymbol
  // const stakingTokenName = data.stakingTokenName

  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false)
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false)
  const router = useRouter()

  function onStakeModalOpen () {
    setIsStakeModalOpen(true)
    analyticsLogger(() => logStakingPoolDepositPopupToggled(networkId, account ?? null, poolKey, true))
  }
  function onStakeModalClose () {
    setIsStakeModalOpen(false)
    analyticsLogger(() => logStakingPoolDepositPopupToggled(networkId, account ?? null, poolKey, false))
  }

  function onCollectModalClose () {
    setIsCollectModalOpen(false)
    analyticsLogger(() => logStakingPoolCollectPopupToggled(networkId, account, poolKey, false))
  }
  function onCollectModalOpen () {
    setIsCollectModalOpen(true)
    analyticsLogger(() => logStakingPoolCollectPopupToggled(networkId, account, poolKey, true))
  }

  const poolKey = data.key
  const stakedAmount = info.myStake
  const rewardAmount = info.rewards

  const hasStaked = isGreater(info.myStake, '0')
  const approxBlockTime =
    config.networks.getChainConfig(networkId).approximateBlockTime
  const lockupPeriod = toBN(data.lockupPeriodInBlocks).multipliedBy(
    approxBlockTime
  )

  const rTokenImgSrc = getTokenImgSrc(rewardTokenSymbol)
  const sTokenImgSrc = getTokenImgSrc(stakingTokenSymbol)
  const poolName = info.name

  const apr = getApr(networkId, {
    stakingTokenPrice: getPriceByAddress(info.stakingToken),
    rewardPerBlock: info.rewardPerBlock,
    rewardTokenPrice: getPriceByAddress(info.rewardToken)
  })

  // Used for sorting purpose only
  useEffect(() => {
    setStatsByKey(poolKey, { apr })
  }, [apr, poolKey, setStatsByKey])

  const stats = []

  if (hasStaked) {
    stats.push({
      title: t`Your Stake`,
      value: formatCurrency(
        convertFromUnits(stakedAmount),
        router.locale,
        stakingTokenSymbol,
        true
      ).long,
      tooltip: formatCurrency(
        convertFromUnits(stakedAmount),
        router.locale,
        stakingTokenSymbol,
        true
      ).long
    })
    stats.push({
      title: t`You Earned`,
      value: formatCurrency(
        convertFromUnits(rewardAmount),
        router.locale,
        rewardTokenSymbol,
        true
      ).short,
      tooltip: formatCurrency(
        convertFromUnits(rewardAmount),
        router.locale,
        rewardTokenSymbol,
        true
      ).long
    })
  }

  stats.push({
    title: t`Lockup Period`,
    value: `${explainInterval(data.lockupPeriodInBlocks * approxBlockTime)}`
  })

  stats.push(
    {
      title: t`TVL`,
      value: formatCurrency(
        convertFromUnits(tvl, liquidityTokenDecimals),
        router.locale,
        'USD'
      ).short,
      tooltip: formatCurrency(
        convertFromUnits(tvl, liquidityTokenDecimals),
        router.locale,
        'USD'
      ).long
    }
  )

  if (info.name === '') {
    return <CardSkeleton numberOfCards={1} />
  }

  const stakeModalTitle = (
    <div className='flex items-center'>
      <div className='mr-8'>
        <DoubleImage
          images={[
            { src: sTokenImgSrc, alt: stakingTokenSymbol },
            { src: rTokenImgSrc, alt: rewardTokenSymbol }
          ]}
        />
      </div>

      <h3>
        <Trans>Earn</Trans> {rewardTokenSymbol}
      </h3>
    </div>
  )

  const collectModalTitle = stakeModalTitle

  return (
    <OutlinedCard className='px-6 pt-6 pb-10 bg-white'>
      <div className='flex items-start justify-between'>
        <div>
          <DoubleImage
            images={[
              { src: sTokenImgSrc, alt: stakingTokenSymbol },
              { src: rTokenImgSrc, alt: rewardTokenSymbol }
            ]}
          />
        </div>

        <Badge className='text-21AD8C'>
          <Trans>APR: {formatPercent(apr, router.locale)}</Trans>
        </Badge>
      </div>

      <StakingCardTitle text={poolName} />
      <StakingCardSubTitle text={t`Stake ${stakingTokenSymbol}`} />

      <hr className='mt-4 mb-5 border-t border-B0C4DB' />

      {stats.map((x) => (
        <div className='block mt-2' key={x.title}>
          <div className='flex flex-row justify-between w-full text-sm'>
            <PoolCardStat tooltip={x?.tooltip} value={x.value} title={x.title} />
          </div>
        </div>
      ))}

      <div className='flex items-center mt-5'>
        {hasStaked
          ? (
            <div className='flex items-center w-full'>
              <StakingCardCTA
                className='px-2 mr-2 text-white w-fit'
                onClick={onStakeModalOpen}
                aria-label='Add Stake'
                title='Open Stake Modal'
              >
                <AddIcon width={16} fill='currentColor' />
              </StakingCardCTA>
              <StakingCardCTA
                className='flex-grow w-auto px-5 py-2 text-sm font-semibold uppercase'
                onClick={onCollectModalOpen}
              >
                <Trans>Collect</Trans>
              </StakingCardCTA>
            </div>
            )
          : (
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
  )
}
