import { InfoTooltip } from '@/common/Cover/InfoTooltip'
import AddIcon from '@/icons/AddIcon'

export const LiquidityGaugeCardAction = ({ lockupPeriod, tokenName, tokenIcon, isLock }) => {
  return (
    <div className='flex flex-row items-center justify-between'>
      <div className='flex flex-col gap-1'>
        <div className='text-sm text-999BAB'>
          Lockup Period:{' '}
          <span className='font-semibold text-01052D'>
            {new Date(lockupPeriod).getHours()} hrs approx
          </span>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <div className='text-sm text-999BAB'>Reward Tokens:</div>
          <InfoTooltip infoComponent={`${tokenName} Token`} className='text-[11px] px-2 py-0.75 bg-opacity-100'>
            <img src={tokenIcon} alt='npm_icon' className='w-6' />
          </InfoTooltip>
        </div>
      </div>

      {isLock
        ? (
          <button className='px-4 py-3 font-semibold tracking-wide text-white uppercase rounded-[10px] bg-4e7dd9 hover:bg-opacity-90 max-w-[216px] flex-auto'>
            Lock
          </button>
          )
        : (
          <div className='flex flex-row gap-2'>
            <button className='px-4 py-3 font-semibold tracking-wide text-white uppercase rounded-[10px] bg-4e7dd9 hover:bg-opacity-90  w-[156px] flex-auto'>
              Receive
            </button>
            <button className='px-4 py-3 font-semibold tracking-wide uppercase rounded-[10px] bg-4e7dd9 hover:bg-opacity-90'>
              <AddIcon
                className='w-5 h-5 fill-white'
              />
            </button>
          </div>
          )}
    </div>
  )
}
