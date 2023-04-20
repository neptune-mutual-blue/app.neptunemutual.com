import { TokenAvatar } from '@/modules/swap/add-liquidity/TokenAvatar'

const PoolShare = ({ selectedPair }) => {
  return (
    <div className='p-4 bg-F3F5F7 rounded-tooltip mt-4'>
      <div className='flex flex-col gap-4'>

        <div className='text-sm text-center'>Initial prices and pool share</div>

        <hr className='border-t border-B0C4DB' />

        <div className='flex items-center justify-between'>
          <div className='text-sm'>Pooled {selectedPair[0].symbol}</div>
          <div className='flex items-center text-sm gap-1'>
            <div>1</div>
            <TokenAvatar className='h-5 w-5' />
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div className='text-sm'>Pooled {selectedPair[1].symbol}</div>
          <div className='flex items-center text-sm gap-1'>
            <div>12807.76</div>
            <TokenAvatar className='h-5 w-5' />
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div className='text-sm'>Your pool tokens:</div>
          <div className='flex items-center text-sm gap-1'>
            <div>9999.99</div>
            <TokenAvatar className='h-5 w-5' />
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div className='text-sm'>Your pool share:</div>
          <div className='flex items-center text-sm gap-1'>
            <div>100%</div>
            <TokenAvatar className='h-5 w-5' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PoolShare
