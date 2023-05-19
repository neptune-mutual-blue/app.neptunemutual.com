import { useRouter } from 'next/router'

import { formatCurrency } from '@/utils/formatter/currency'

export const LiquidityGaugeBalanceDetails = ({ balance, token, emissionReceived, lockupPeriod, tvl }) => {
  const router = useRouter()

  return (
    <div className='flex flex-col gap-4 p-4 bg-F3F5F7 rounded-xl w-full md:max-w-420 text-sm mt-6 md:mt-8.5 flex-auto'>
      <div className='flex flex-row justify-between'>
        <span>Your Balance</span>
        <span className='font-semibold'>{`${formatCurrency(balance, router.locale, '', true, true).long} ${token}`}</span>
      </div>
      <div className='flex flex-row justify-between'>
        <span>Emission Received</span>
        <span className='font-semibold'>{emissionReceived} NPM</span>
      </div>
      <div className='flex flex-row justify-between'>
        <span>Lockup Period</span>
        <span className='font-semibold'>{new Date(lockupPeriod).getHours()} hrs</span>
      </div>
      <div className='flex flex-row justify-between'>
        <span>TVL</span>
        <span className='font-semibold'>{formatCurrency(tvl).short}</span>
      </div>
    </div>
  )
}
