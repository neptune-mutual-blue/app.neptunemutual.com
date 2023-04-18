import { useRef } from 'react'

import InfoCircleIcon from '@/icons/InfoCircleIcon'
import LeftArrow from '@/icons/LeftArrow'
import WarningCircleIcon from '@/icons/WarningCircleIcon'
import { useLocalStorage } from '@/src/hooks/useLocalStorage'

const slippageOptions = [0.1, 0.5, 1.0]

const highSlippanceTolerance = 25
const lowSlippanceTolerance = 0.1

export const TradeSettings = ({ show, hide }) => {
  const [selectedSlippage, setSelectedSlippage] = useLocalStorage('swap_slippage_settings', 0.5)
  const [transactionDeadline, setTransactionDeadline] = useLocalStorage('swap_transaction_deadline_settings', '30')

  const resetCustom = () => {
    ref.current.value = ''
  }
  const ref = useRef(null)

  if (!show) return <></>

  const hasLowSlippanceTolerance = selectedSlippage <= lowSlippanceTolerance
  const hasHighSlippanceTolerance = selectedSlippage >= highSlippanceTolerance

  const hasHighOrLowSlippanceTolerance = hasLowSlippanceTolerance || hasHighSlippanceTolerance

  return (
    <div className='min-h-647'>
      <div className='grid grid-cols-3'>
        <button
          className='flex items-center gap-2.5 text-xs font-semibold leading-6 rounded-2 tracking-2'
          onClick={hide}
        >
          <LeftArrow />
          <span className='text-xs leading-6 font-semibold'>
            BACK
          </span>
        </button>
        <h3 className='text-display-xs font-semibold'>Settings</h3>
      </div>

      <hr className='h-1 my-4 text-B0C4DB' />

      <div className='flex justify-between items-center'>
        <div className='text-lg font-semibold flex items-center gap-1'>Slippage <InfoCircleIcon className='h-4 w-4' /></div>
        <div className={'text-md font-semibold' + (hasHighOrLowSlippanceTolerance ? ' text-E52E2E' : '')}>{selectedSlippage}%</div>
      </div>

      {hasHighOrLowSlippanceTolerance && (
        <div className='py-3 px-4 pr-2 flex gap-4 mt-4 border border-E52E2E border-l-4 rounded-3px text-E52E2E bg-E52E2E-0.03'>
          <div>
            <WarningCircleIcon />
          </div>
          <div className='text-sm'>
            {hasHighSlippanceTolerance && 'Your transaction may be frontrun due to high slippage tolerance.'}
            {hasLowSlippanceTolerance && 'Your transaction may be reverted due to low slippage tolerance.'}
          </div>
        </div>
      )}

      <div className='p-2 grid grid-cols-4 bg-E6EAEF rounded-2 gap-2 mb-6 mt-4'>
        {slippageOptions.map(option => (

          <button
            onClick={() => {
              setSelectedSlippage(option)
              resetCustom()
            }}
            key={option}
            className={`rounded-2 py-2.5 px-25px cursor-pointer text-md ${option === selectedSlippage ? ' bg-white' : ''}`}
          >
            {option.toFixed(1)}%
          </button>
        ))}

        <input
          ref={ref}
          defaultValue={!slippageOptions.includes(selectedSlippage) ? selectedSlippage : undefined}
          className={`${!slippageOptions.includes(selectedSlippage) ? 'bg-white rounded-2 border border-4e7dd9' : 'bg-transparent'} text-center placeholder-01052D`} placeholder='Custom' onChange={(e) => {
            setSelectedSlippage(parseFloat(e.target.value))
          }}
        />
      </div>

      <div className='text-lg font-semibold flex items-center gap-1'>Transaction Deadline <InfoCircleIcon className='h-4 w-4' /></div>

      <div className=' flex justify-between bg-E6EAEF rounded-2 mt-4'>
        <input
          className='bg-transparent text-md p-4' value={transactionDeadline} onChange={(e) => {
            setTransactionDeadline(e.target.value)
          }}
        />
        <div className='text-md p-4'>min</div>
      </div>

    </div>
  )
}
