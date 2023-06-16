import { useMemo } from 'react'

import { useAppConstants } from '@/src/context/AppConstants'
import {
  useLiquidityGaugePoolPricing
} from '@/src/hooks/useLiquidityGaugePoolPricing'

import { LiquidityGaugePoolCard } from './LiquidityGaugePoolCard'

export const LiquidityGaugePoolsList = ({ pools = [] }) => {
  const { NPMTokenAddress, NPMTokenSymbol, NPMTokenDecimals } = useAppConstants()
  const rewardTokenAddress = NPMTokenAddress
  const rewardTokenSymbol = NPMTokenSymbol
  const rewardTokenDecimals = NPMTokenDecimals

  const tokenData = useMemo(() => {
    return pools.map(pool => {
      return {
        type: 'pod',
        address: pool.stakingToken
      }
    }).concat({
      type: 'token',
      address: rewardTokenAddress
    })
  }, [pools, rewardTokenAddress])

  const { getPriceByToken } = useLiquidityGaugePoolPricing(tokenData)

  return (
    <div role='list' className='divide-y divide-B0C4DB border-[1px] border-B0C4DB rounded-2xl'>
      {pools.map((pool) => {
        return (
          <LiquidityGaugePoolCard
            key={pool.key}
            pool={pool}
            rewardTokenSymbol={rewardTokenSymbol}
            rewardTokenDecimals={rewardTokenDecimals}
            getPriceByToken={getPriceByToken}
          />
        )
      })}
    </div>
  )
}
