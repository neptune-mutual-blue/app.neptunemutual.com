import { useState } from 'react'

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
import { useNetwork } from '@/src/context/Network'
import { getCoverImgSrc } from '@/src/helpers/cover'
import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import { useTokenDecimals } from '@/src/hooks/useTokenDecimals'
import { useTokenSymbol } from '@/src/hooks/useTokenSymbol'
import { toBN } from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { config } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

const DescriptionOrDetail = ({
  lock,
  description,
  emissionReceived,
  lockupPeriod,
  // tvl,
  rewardTokenSymbol,
  stakingTokenBalance,
  stakingTokenSymbol,
  stakingTokenDecimals,
  mobile = false
}) => {
  const { active } = useWeb3React()

  return (
    <div className={classNames(mobile && 'md:hidden', !mobile && 'hidden md:block')}>
      {lock || !active
        ? <p className='max-w-xl mt-6 font-normal text-999BAB md:mt-0'>{description}</p>
        : <LiquidityGaugeBalanceDetails
            rewardTokenSymbol={rewardTokenSymbol}
            stakingTokenBalance={stakingTokenBalance}
            stakingTokenSymbol={stakingTokenSymbol}
            stakingTokenDecimals={stakingTokenDecimals}
            emissionReceived={emissionReceived}
            lockupPeriod={lockupPeriod}
            // tvl={tvl}
          />}
    </div>
  )
}
export const LiquidityGaugePoolsList = ({ data = [] }) => {
  return (
    <div role='list' className='divide-y divide-B0C4DB border-[1px] border-B0C4DB rounded-2xl'>
      {data.slice(0, 2).map((pool) => (
        <LiquidityGaugePoolCard
          key={pool.key}
          pool={pool}
        />
      ))}
    </div>
  )
}

const LiquidityGaugePoolCard = ({ pool }) => {
  const { networkId } = useNetwork()
  const { NPMTokenSymbol, NPMTokenDecimals } = useAppConstants()
  const [lockedAndReward, setLockedAndReward] = useState({
    locked: '0',
    reward: '0'
  })

  const stakingToken = pool.token
  const rewardTokenSymbol = NPMTokenSymbol

  const { balance: stakingTokenBalance } = useERC20Balance(stakingToken)
  const stakingTokenSymbol = useTokenSymbol(stakingToken)
  const stakingTokenDecimals = useTokenDecimals(stakingToken)

  const approxBlockTime = config.networks.getChainConfig(networkId).approximateBlockTime
  const lockupPeriod = toBN(pool.lockupPeriodInBlocks).multipliedBy(approxBlockTime)

  return (
    <div className='p-8 bg-white first:rounded-t-2xl last:rounded-b-2xl' key={pool.id}>
      <div className='flex flex-col md:gap-10'>
        <div className='grid grid-cols-1 md:grid-cols-[1fr_auto] items-start justify-between'>
          <div className='flex flex-col gap-4'>
            <LiquidityGaugeCardHeading
              title={pool.name}
              stakingTokenSymbol={stakingTokenSymbol}
            />

            {
              toBN(lockedAndReward.locked).isGreaterThan(0) &&
              (
                <DescriptionOrDetail
                  lock={pool.lock}
                  description={pool.description}
                  rewardTokenSymbol={rewardTokenSymbol}
                  stakingTokenBalance={stakingTokenBalance}
                  stakingTokenSymbol={stakingTokenSymbol}
                  stakingTokenDecimals={stakingTokenDecimals}
                  // tvl={pool.tvl}
                  emissionReceived={lockedAndReward.reward}
                  lockupPeriod={lockupPeriod}
                />
              )
            }
          </div>

          <LiquidityGaugeBoostDetails
            // tokenValue={pool.npm}
            boost={pool.boost}
          />
        </div>

        {
          toBN(lockedAndReward.locked).isGreaterThan(0) &&
          (
            <DescriptionOrDetail
              lock={pool.lock}
              description={pool.description}
              rewardTokenSymbol={rewardTokenSymbol}
              stakingTokenBalance={stakingTokenBalance}
              stakingTokenSymbol={stakingTokenSymbol}
              stakingTokenDecimals={stakingTokenDecimals}
              // tvl={pool.tvl}
              emissionReceived={lockedAndReward.reward}
              lockupPeriod={lockupPeriod}
              mobile
            />
          )
        }

        <LiquidityGaugeCardAction
          lockupPeriod={lockupPeriod}
          tokenIcon={getCoverImgSrc({ key: 'npm' })}
          tokenSymbol={stakingTokenSymbol}
          tokenDecimals={stakingTokenDecimals}
          stakingToken={stakingToken}
          poolKey={pool.key}
          setLockedAndReward={setLockedAndReward}
          NPMTokenSymbol={NPMTokenSymbol}
          NPMTokenDecimals={NPMTokenDecimals}
        />
      </div>
    </div>
  )
}
