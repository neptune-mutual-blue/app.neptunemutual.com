import { useMemo } from 'react'

import {
  LiquidityGaugeBalanceDetails
} from '@/modules/pools/liquidity-gauge-pools/LiquidityGaugeBalanceDetails'
import {
  LiquidityGaugeBoostDetails
} from '@/modules/pools/liquidity-gauge-pools/LiquidityGaugeBoostDetails'
import {
  LiquidityGaugeCardAction
} from '@/modules/pools/liquidity-gauge-pools/LiquidityGaugeCardAction'
import {
  LiquidityGaugeCardHeading
} from '@/modules/pools/liquidity-gauge-pools/LiquidityGaugeCardHeading'
import { useAppConstants } from '@/src/context/AppConstants'
import {
  useLiquidityGaugePoolPricing
} from '@/src/hooks/useLiquidityGaugePoolPricing'
import {
  useLiquidityGaugePoolStakedAndReward
} from '@/src/hooks/useLiquidityGaugePoolStakedAndReward'
import {
  convertFromUnits,
  toBN
} from '@/utils/bn'
import { classNames } from '@/utils/classnames'

const DescriptionOrDetail = ({
  description = '',
  emissionReceived,
  lockupPeriodInBlocks,
  tvl,
  rewardTokenSymbol,
  rewardTokenDecimals,
  stakedBalance,
  stakingTokenSymbol,
  stakingTokenDecimals,
  mobile = false
}) => {
  return (
    <div className={classNames(mobile && 'md:hidden', !mobile && 'hidden md:block')}>
      {toBN(stakedBalance).isZero()
        ? <p className='max-w-xl mt-6 font-normal text-999BAB md:mt-0'>{description}</p>
        : <LiquidityGaugeBalanceDetails
            rewardTokenSymbol={rewardTokenSymbol}
            rewardTokenDecimals={rewardTokenDecimals}
            stakedBalance={stakedBalance}
            stakingTokenSymbol={stakingTokenSymbol}
            stakingTokenDecimals={stakingTokenDecimals}
            emissionReceived={emissionReceived}
            lockupPeriodInBlocks={lockupPeriodInBlocks}
            tvl={tvl}
          />}
    </div>
  )
}
export const LiquidityGaugePoolsList = ({ pools = [] }) => {
  const { NPMTokenAddress, NPMTokenSymbol, NPMTokenDecimals } = useAppConstants()
  const rewardTokenAddress = NPMTokenAddress
  const rewardTokenSymbol = NPMTokenSymbol
  const rewardTokenDecimals = NPMTokenDecimals

  const tokenData = useMemo(() => {
    return pools.map(pool => ({
      type: 'pod',
      address: pool.stakingToken
    })).concat({
      type: 'token',
      address: rewardTokenAddress
    })
  }, [pools, rewardTokenAddress])

  const { getPriceByToken } = useLiquidityGaugePoolPricing(tokenData)

  return (
    <div role='list' className='divide-y divide-B0C4DB border-[1px] border-B0C4DB rounded-2xl'>
      {pools.map((pool) => (
        <LiquidityGaugePoolCard
          key={pool.key}
          pool={pool}
          rewardTokenSymbol={rewardTokenSymbol}
          rewardTokenDecimals={rewardTokenDecimals}
          getPriceByToken={getPriceByToken}
        />
      ))}
    </div>
  )
}

const LiquidityGaugePoolCard = ({
  pool,
  rewardTokenSymbol,
  rewardTokenDecimals,
  getPriceByToken
}) => {
  const poolAddress = pool.poolAddress

  const stakingTokenAddress = pool.stakingToken
  const stakingTokenSymbol = pool.stakingTokenSymbol
  const stakingTokenDecimals = pool.stakingTokenDecimals
  const lockupPeriodInBlocks = pool.lockupPeriodInBlocks

  // const approxBlockTime = config.networks.getChainConfig(networkId).approximateBlockTime
  // const lockupPeriod = toBN(pool.lockupPeriodInBlocks).multipliedBy(approxBlockTime)

  const { lockedByMe, rewardAmount, lockedByEveryone, update: updateStakedAndReward } = useLiquidityGaugePoolStakedAndReward({ poolAddress })

  const stakingTokenTVL = convertFromUnits(toBN(getPriceByToken(stakingTokenAddress)).multipliedBy(lockedByEveryone).toString(), stakingTokenDecimals)

  return (
    <div className='p-8 bg-white first:rounded-t-2xl last:rounded-b-2xl' key={pool.id}>
      <div className='flex flex-col md:gap-10'>
        <div className='grid grid-cols-1 md:grid-cols-[1fr_auto] items-start justify-between'>
          <div className='flex flex-col gap-4'>
            <LiquidityGaugeCardHeading
              poolKey={pool.key}
              title={pool.name}
              stakingTokenSymbol={stakingTokenSymbol}
            />

            <DescriptionOrDetail
              description={pool?.infoDetails?.description}
              rewardTokenSymbol={rewardTokenSymbol}
              rewardTokenDecimals={rewardTokenDecimals}
              stakedBalance={lockedByMe}
              stakingTokenSymbol={stakingTokenSymbol}
              stakingTokenDecimals={stakingTokenDecimals}
              tvl={stakingTokenTVL}
              emissionReceived={rewardAmount}
              lockupPeriodInBlocks={lockupPeriodInBlocks}
            />
          </div>

          <LiquidityGaugeBoostDetails
            epochDuration={pool.epochDuration}
            currentEpoch={pool.currentEpoch}
            rewardTokenDecimals={rewardTokenDecimals}
            currentDistribution={pool.currentDistribution}
          />
        </div>

        <DescriptionOrDetail
          description={pool?.infoDetails?.description}
          rewardTokenSymbol={rewardTokenSymbol}
          rewardTokenDecimals={rewardTokenDecimals}
          stakedBalance={lockedByMe}
          stakingTokenSymbol={stakingTokenSymbol}
          stakingTokenDecimals={stakingTokenDecimals}
          tvl={stakingTokenTVL}
          emissionReceived={rewardAmount}
          lockupPeriodInBlocks={lockupPeriodInBlocks}
          mobile
        />

        <LiquidityGaugeCardAction
          poolAddress={poolAddress}
          lockupPeriodInBlocks={lockupPeriodInBlocks}
          // tokenIcon={getCoverImgSrc({ key: '' })}
          stakingTokenIcon='/images/tokens/npm.svg'
          stakingTokenSymbol={stakingTokenSymbol}
          stakingTokenDecimals={stakingTokenDecimals}
          stakingTokenAddress={stakingTokenAddress}
          rewardTokenSymbol={rewardTokenSymbol}
          rewardTokenDecimals={rewardTokenDecimals}
          poolStaked={lockedByMe}
          rewardAmount={rewardAmount}
          updateStakedAndReward={updateStakedAndReward}
        />
      </div>
    </div>
  )
}
