import React from 'react'

const EscrowSummary = ({ veNPMBalance, unlockTimestamp }) => {
  return (
    <div className='border-t-1 border-b-1 border-B0C4DB p-8'>
      <div className='flex justify-between mb-6'>
        <div>
          <div className='text-md font-semibold mb-1'>Total Vote-Locked</div>
          <div className='text-xl'>25.2K NPM</div>
        </div>
        <div>
          <div className='text-md font-semibold mb-1'>Max Boost</div>
          <div className='text-xl'>4x</div>
        </div>
        <div>
          <div className='text-md font-semibold mb-1'>Average Lock</div>
          <div className='text-xl'>52 weeks</div>
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='text-sm'>
          <span className='font-semibold'>Your veNPM Balance:</span> <span title={veNPMBalance.long}>{veNPMBalance.short}</span>
        </div>
        <div className='text-sm'>
          <span className='font-semibold'>Your Unlock Timestamp:</span> {unlockTimestamp}
        </div>
        <div className='text-sm'>
          <span className='font-semibold'>Premature Unlock Penalty:</span> 25%
        </div>
      </div>
    </div>
  )
}

export default EscrowSummary
