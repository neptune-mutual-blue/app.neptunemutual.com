import { CoverAvatar } from '@/common/CoverAvatar'

export const LiquidityGaugeCardHeading = ({ title, subtitle, stake, icons }) => {
  return (
    <div className='flex gap-6.5 items-center'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-xl font-semibold text-01052D'>{title}</h1>
        <h1 className='text-sm text-999BAB'>{`${stake ? 'Stake' : 'Receive'} ${subtitle}`}</h1>
      </div>

      <CoverAvatar imgs={icons} />
    </div>
  )
}
