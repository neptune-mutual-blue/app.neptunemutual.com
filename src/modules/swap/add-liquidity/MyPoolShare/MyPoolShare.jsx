import React from 'react'

import { TokenAvatar } from '@/modules/swap/add-liquidity/TokenAvatar'
import { TokenPair } from '@/modules/swap/add-liquidity/TokenPair'

const MyPoolShare = ({ selectedPair, footer }) => {
  return (
    <div className='p-4 mt-4 bg-F3F5F7 rounded-tooltip'>
      <div className='flex flex-col gap-4'>

        <div className='flex items-center justify-between'>
          <TokenPair pair={selectedPair} />

        </div>

        <div className='flex items-center justify-between'>
          <div className='text-sm'>Pooled {selectedPair[0].symbol}</div>
          <div className='flex items-center text-sm gap-1'>
            <div className='font-semibold'>1</div>
            <TokenAvatar className='h-5 w-5' />
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div className='text-sm'>Pooled {selectedPair[1].symbol}</div>
          <div className='flex items-center text-sm gap-1'>
            <div className='font-semibold'>12807.76</div>
            <TokenAvatar className='h-5 w-5' />
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div className='text-sm'>Your pool tokens:</div>
          <div className='flex items-center text-sm gap-1'>
            <div className='font-semibold'>9999.99</div>
            <TokenAvatar className='h-5 w-5' />
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div className='text-sm'>Your pool share:</div>
          <div className='flex items-center text-sm gap-1'>
            <div className='font-semibold'>100%</div>
            <TokenAvatar className='h-5 w-5' />
          </div>
        </div>

        {footer}

      </div>

    </div>
  )
}

export default MyPoolShare
