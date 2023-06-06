import { useRouter } from 'next/router'

import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { explainInterval } from '@/utils/formatter/interval'

export const LiquidityGaugeBalanceDetails = ({
  rewardTokenSymbol,
  stakingTokenBalance,
  stakingTokenSymbol,
  stakingTokenDecimals,
  emissionReceived,
  lockupPeriod
  // tvl
}) => {
  const router = useRouter()

  const formattedBalance = formatCurrency(
    convertFromUnits(stakingTokenBalance, stakingTokenDecimals),
    router.locale,
    stakingTokenSymbol,
    true
  )

  return (
    <div className='flex flex-col gap-4 p-4 bg-F3F5F7 rounded-xl w-full md:max-w-420 text-sm mt-6 md:mt-8.5 flex-auto'>
      <div className='flex flex-row justify-between'>
        <span>Your Locked Balance</span>
        <span
          title={formattedBalance.long}
          className='font-semibold'
        >{formattedBalance.short}
        </span>
      </div>
      <div className='flex flex-row justify-between'>
        <span>Emission Received</span>
        <span className='font-semibold'>{emissionReceived} {rewardTokenSymbol}</span>
      </div>
      <div className='flex flex-row justify-between'>
        <span>Lockup Period</span>
        <span className='font-semibold'>{explainInterval(lockupPeriod)}</span>
      </div>
      {/* <div className='flex flex-row justify-between'>
        <span>TVL</span>
        <span className='font-semibold'>{formatCurrency(tvl).short}</span>
      </div> */}
    </div>
  )
}
