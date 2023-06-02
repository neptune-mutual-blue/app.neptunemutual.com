import React from 'react'

import { classNames } from '@/utils/classnames'
import { fromNow } from '@/utils/formatter/relative-time'

const EscrowSummary = ({ veNPMBalance, unlockTimestamp, ...rest }) => {
  const { className } = rest
  const unlockDate = (unlockTimestamp !== '0' ? new Date(unlockTimestamp) : new Date())

  return (
    <div className={classNames('rounded-lg p-6', className)}>
      <div className='flex flex-col sm:flex-row justify-between gap-4 mb-4'>
        <div>
          <div className='text-sm text-999BAB font-semibold mb-1'>Total Vote-Locked</div>
          <div className='text-xl'>25.2K NPM</div>
        </div>
        <div>
          <div className='text-sm text-999BAB font-semibold mb-1'>Max Boost</div>
          <div className='text-xl'>4x</div>
        </div>
        <div>
          <div className='text-sm text-999BAB font-semibold mb-1'>Average Lock</div>
          <div className='text-xl'>52 weeks</div>
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='text-sm flex justify-between'>
          <span>Your veNPM Balance:</span>
          <span className='font-semibold' title={veNPMBalance.long}>{veNPMBalance.short}</span>
        </div>
        <div className='text-sm flex justify-between'>
          <span>Your Unlock Timestamp:</span> <span className='font-semibold' title={unlockTimestamp}>{unlockTimestamp !== '0' ? fromNow(unlockDate) : 'N/A'}</span>
        </div>
        <div className='text-sm flex justify-between'>
          <span>Premature Unlock Penalty:</span> <span className='font-semibold'>25%</span>
        </div>
      </div>
    </div>
  )
}

export default EscrowSummary
