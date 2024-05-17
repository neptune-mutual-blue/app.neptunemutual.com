import { useAppConstants } from '@/src/context/AppConstants'

import { LiquidityGaugePoolCard } from './LiquidityGaugePoolCard'

export const LiquidityGaugePoolsList = ({ pools = [] }) => {
  const { NPMTokenSymbol, NPMTokenDecimals, liquidityTokenDecimals } = useAppConstants()
  const rewardTokenSymbol = NPMTokenSymbol
  const rewardTokenDecimals = NPMTokenDecimals

  return (
    <div role='list' className='divide-y divide-B0C4DB border-[1px] border-B0C4DB rounded-2xl'>
      {pools.map((pool) => {
        return (
          <LiquidityGaugePoolCard
            key={pool.key}
            pool={pool}
            rewardTokenSymbol={rewardTokenSymbol}
            rewardTokenDecimals={rewardTokenDecimals}
            liquidityTokenDecimals={liquidityTokenDecimals}
          />
        )
      })}
    </div>
  )
}
