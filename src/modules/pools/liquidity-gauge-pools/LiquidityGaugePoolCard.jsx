import {
  LiquidityGaugeBoostDetails
} from '@/modules/pools/liquidity-gauge-pools/LiquidityGaugeBoostDetails'
import {
  LiquidityGaugeCardAction
} from '@/modules/pools/liquidity-gauge-pools/LiquidityGaugeCardAction'
import {
  LiquidityGaugeCardHeading
} from '@/modules/pools/liquidity-gauge-pools/LiquidityGaugeCardHeading'
import {
  LiquidityGaugePoolStats
} from '@/modules/pools/liquidity-gauge-pools/LiquidityGaugePoolStats'
import {
  useLiquidityGaugePoolStakedAndReward
} from '@/src/hooks/useLiquidityGaugePoolStakedAndReward'

import { PoolDescription } from './PoolDescription'

export function LiquidityGaugePoolCard ({
  pool,
  rewardTokenSymbol,
  rewardTokenDecimals,
  liquidityTokenDecimals
}) {
  const poolAddress = pool.poolAddress
  const stakingTokenAddress = pool.stakingToken
  const stakingTokenSymbol = pool.stakingTokenSymbol
  const stakingTokenDecimals = pool.stakingTokenDecimals
  const lockupPeriodInBlocks = pool.lockupPeriodInBlocks
  const stakingTokenTVL = pool.tvl

  // const approxBlockTime = config.networks.getChainConfig(networkId).approximateBlockTime
  // const lockupPeriod = toBN(pool.lockupPeriodInBlocks).multipliedBy(approxBlockTime)

  // @TODO: Use lockedByEveryone for tvl, if it exists
  // eslint-disable-next-line unused-imports/no-unused-vars, no-unused-vars
  const { lockedByMe, rewardAmount, lockedByEveryone, update: updateStakedAndReward } = useLiquidityGaugePoolStakedAndReward({ poolAddress })

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

            <PoolDescription
              description={pool?.infoDetails?.description}
              stakedBalance={lockedByMe}
            />
          </div>

          <LiquidityGaugeBoostDetails
            epochDuration={pool.epochDuration}
            currentEpoch={pool.currentEpoch}
            rewardTokenDecimals={rewardTokenDecimals}
            currentDistribution={pool.currentDistribution}
          />
        </div>

        <PoolDescription
          description={pool?.infoDetails?.description}
          stakedBalance={lockedByMe}
          mobile
        />

        <div className='flex flex-col justify-between mt-6 md:mt-0 md:flex-row md:items-end'>
          <LiquidityGaugePoolStats
            lockupPeriodInBlocks={lockupPeriodInBlocks}
            stakingTokenSymbol={stakingTokenSymbol}
            stakingTokenDecimals={stakingTokenDecimals}
            rewardTokenSymbol={rewardTokenSymbol}
            rewardTokenDecimals={rewardTokenDecimals}
            lockedByMe={lockedByMe}
            rewardAmount={rewardAmount}
            tvl={stakingTokenTVL}
            liquidityTokenDecimals={liquidityTokenDecimals}
          />

          <LiquidityGaugeCardAction
            poolAddress={poolAddress}
          // tokenIcon={getCoverImgSrc({ key: '' })}
            stakingTokenIcon='/images/tokens/npm.svg'
            updateStakedAndReward={updateStakedAndReward}
            lockupPeriodInBlocks={lockupPeriodInBlocks}
            lockedByMe={lockedByMe}
            stakingTokenSymbol={stakingTokenSymbol}
            stakingTokenDecimals={stakingTokenDecimals}
            stakingTokenAddress={stakingTokenAddress}
            rewardAmount={rewardAmount}
            rewardTokenSymbol={rewardTokenSymbol}
            rewardTokenDecimals={rewardTokenDecimals}
          />
        </div>
      </div>
    </div>
  )
}
