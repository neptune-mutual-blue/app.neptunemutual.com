import { useState } from 'react'

import ExpandIcon from '@/icons/ExpandIcon'
import { TokenPair } from '@/modules/swap/add-liquidity/TokenPair'

const MyLiquiditySelect = ({ liquidityPairs, onSelectionChange }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className='rounded-tooltip bg-F3F5F7 mt-4 overflow-hidden'>
      <button
        className='flex items-center justify-between w-full p-4' onClick={() => {
          setOpen(!open)
        }}
      >
        <div className='text-sm'>Select your liquidity</div>
        <ExpandIcon className={'h-4 w-4' + (open ? '' : ' -scale-y-100')} />
      </button>

      {open && (
        <>
          <hr className='border-t border-B0C4DB mx-4' />
          <div className='max-h-[215px] overflow-auto'>
            {liquidityPairs.map((pair, i) => (
              <button
                className='py-3 px-4 w-full hover:bg-DEEAF6 flex items-center justify-between' onClick={() => {
                  onSelectionChange(i)
                  setOpen(false)
                }} key={i}
              >
                <TokenPair pair={pair} />
              </button>
            ))}
          </div>

        </>
      )}
    </div>
  )
}

export default MyLiquiditySelect
