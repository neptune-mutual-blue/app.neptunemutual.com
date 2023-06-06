import { CoverAvatar } from '@/common/CoverAvatar'

export const LiquidityGaugeCardHeading = ({ title, stakingTokenSymbol, imgSources = [] }) => {
  return (
    <div className='flex gap-6.5 items-start md:items-center flex-col md:flex-row'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-xl font-semibold text-01052D'>{title}</h1>
        <p className='text-sm text-999BAB'>Lock {stakingTokenSymbol}</p>
        {/* <p className='text-sm text-999BAB'>Receive {rewardTokenSymbol}</p> */}
      </div>

      {imgSources && <CoverAvatar imgs={imgSources} />}
    </div>
  )
}
