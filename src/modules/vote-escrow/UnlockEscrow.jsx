import React from 'react'

import { RegularButton } from '@/common/Button/RegularButton'
import BackIcon from '@/icons/BackIcon'
import EscrowSummary from '@/modules/vote-escrow/EscrowSummary'
import KeyValueList from '@/modules/vote-escrow/KeyValueList'
import VoteEscrowCard from '@/modules/vote-escrow/VoteEscrowCard'
import VoteEscrowTitle from '@/modules/vote-escrow/VoteEscrowTitle'

const UnlockEscrow = ({ onBack }) => {
  const caution = true

  return (
    <VoteEscrowCard>
      <VoteEscrowTitle title='Unlock veNPM' />
      <EscrowSummary />

      <div className='p-8'>
        {!caution && (
          <div className='mb-6'>
            <div className='mb-6 text-md font-semibold text-center text-4E7DD9'>Penalty: 0%</div>
            <RegularButton className='w-full rounded-tooltip p-4 font-semibold text-md'>unlock npm</RegularButton>
          </div>
        )}

        {caution && (
          <div className='mb-6'>
            <div className='mb-6 text-md font-semibold text-center text-E52E2E'>Proceed with Caution</div>
            <RegularButton className='w-full rounded-tooltip p-4 bg-E52E2E border-E52E2E font-semibold text-md'>prematurely unlock your npm</RegularButton>
          </div>
        )}

        <KeyValueList
          className='mb-6' list={[
            !caution && {
              key: 'Penalty',
              value: '0 NPM'
            },
            caution && {
              key: 'Penalty',
              value: '250,000 NPM',
              caution: true
            },
            {
              key: 'You Will Receive',
              value: '1,034,334.234 NPM'
            }
          ]}
        />

        <button
          className='uppercase flex items-center gap-2.5 font-semibold text-xs leading-6' onClick={() => {
            onBack()
          }}
        >
          <BackIcon />
          Back
        </button>
      </div>

    </VoteEscrowCard>
  )
}

export default UnlockEscrow
