import { useState } from 'react'

import { RegularButton } from '@/common/Button/RegularButton'
import ArrowDown from '@/icons/ArrowDown'
import InfoCircleIcon from '@/icons/InfoCircleIcon'
import LeftArrow from '@/icons/LeftArrow'
import { TokenAvatar } from '@/modules/swap/add-liquidity/TokenAvatar'

const RemoveLiquidity = ({ selectedPair, hide }) => {
  const [percentage, setPercentage] = useState('100%')

  return (
    <div>
      <div className='flex items-center'>
        <button
          className='flex items-center gap-2.5 text-xs font-semibold leading-6 rounded-2 tracking-2'
          onClick={hide}
        >
          <LeftArrow />
          <span className='text-xs leading-6 font-semibold'>
            BACK
          </span>
        </button>

        <div className='ml-[34.5px] w-full flex justify-between items-center'>

          <h3 className='text-display-xs font-semibold'>Remove Liquidity</h3>

          <InfoCircleIcon className='h-4 w-4' />
        </div>

      </div>

      <div className='py-2.5 bg-f6f7f9 rounded-tooltip mt-6'>
        <div className='text-sm ml-2.5 mb-2 text-404040'>Amount</div>
        <div>
          <input
            value={percentage} onChange={(e) => {
              // eslint-disable-next-line
              if (/^[0-9\.]*%$/.test(e.target.value)) {
                setPercentage(e.target.value)
              }
            }} type='text' className='text-display-sm font-normal bg-transparent px-2.5'
          />
        </div>
      </div>

      <div className='grid grid-cols-4 gap-4 mt-4'>
        <button className='text-md text-4e7dd9 font-semibold bg-DEEAF6 rounded-2 py-2.5' onClick={() => { setPercentage('25%') }}>25%</button>
        <button className='text-md text-4e7dd9 font-semibold bg-DEEAF6 rounded-2 py-2.5' onClick={() => { setPercentage('50%') }}>50%</button>
        <button className='text-md text-4e7dd9 font-semibold bg-DEEAF6 rounded-2 py-2.5' onClick={() => { setPercentage('75%') }}>75%</button>
        <button className='text-md text-4e7dd9 font-semibold bg-DEEAF6 rounded-2 py-2.5' onClick={() => { setPercentage('100%') }}>Max</button>
      </div>

      <ArrowDown className='mx-auto my-4 h-8 w-8 p-1.5' />

      <div className='flex flex-col gap-4 bg-F3F5F7 p-4 rounded-tooltip'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-1 text-sm'>
            <TokenAvatar src={selectedPair[0].logoSrc} className='h-5 w-5' verified={selectedPair[0].verified} />
            {selectedPair[0].symbol}
          </div>

          <div className='text-sm font-semibold'>9999.99</div>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-1 text-sm'>
            <TokenAvatar src={selectedPair[1].logoSrc} className='h-5 w-5' verified={selectedPair[1].verified} />
            {selectedPair[1].symbol}
          </div>

          <div className='text-sm font-semibold'>9999.99</div>
        </div>

        <div className='underline text-4e7dd9 text-sm font-semibold'>Receive Lorem</div>

        <hr className='border-t border-B0C4DB' />

        <div className='flex justify-between items-start'>
          <div className='flex items-center gap-1 text-sm'>
            Price
          </div>

          <div className='text-sm font-semibold'>
            <div className='mb-5px'>
              1 {selectedPair[0].symbol} = 12807.8 {selectedPair[1].symbol}
            </div>
            <div>
              1 {selectedPair[1].symbol} = 12807.8 {selectedPair[0].symbol}
            </div>
          </div>
        </div>

      </div>
      <div className='grid grid-cols-2 gap-4 mt-4'>
        <RegularButton className='font-semibold p-4'>
          Approve
        </RegularButton>

        <button
          className='flex-grow px-6 py-4 mr-4 tracking-wide uppercase font-semibold border border-solid border-4e7dd9 text-4e7dd9 md:py-2 rounded-tooltip min-w-60 md:mr-2'
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default RemoveLiquidity
