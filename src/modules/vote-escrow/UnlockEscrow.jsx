import React from 'react'

import { RegularButton } from '@/common/Button/RegularButton'
import BackIcon from '@/icons/BackIcon'
import EscrowSummary from '@/modules/vote-escrow/EscrowSummary'
import KeyValueList from '@/modules/vote-escrow/KeyValueList'
import VoteEscrowCard from '@/modules/vote-escrow/VoteEscrowCard'
import VoteEscrowTitle from '@/modules/vote-escrow/VoteEscrowTitle'
import { useWeb3React } from '@web3-react/core'

const UnlockEscrow = ({ onBack, data, loading, unlockNPMTokens }) => {
  const { active } = useWeb3React()
  const unlockDate = new Date(data.unlockTimestamp)
  const caution = Date.now().valueOf() - unlockDate.valueOf() < 0

  return (
    <VoteEscrowCard>
      <VoteEscrowTitle title='Unlock veNPM' />
      <EscrowSummary veNPMBalance={data.veNPMBalance} unlockTimestamp={data.unlockTimestamp} />

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
            <RegularButton
              disabled={loading || !active} className='w-full rounded-tooltip p-4 bg-E52E2E border-E52E2E font-semibold text-md' onClick={() => {
                unlockNPMTokens(caution, () => {
                  onBack()
                })
              }}
            >prematurely unlock your npm
            </RegularButton>
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
              value: data.penalty.long,
              caution: true
            },
            {
              key: 'You Will Receive',
              value: caution ? data.receivedAfterPenalty.long : data.veNPMBalance.long
            }
          ].filter(Boolean)}
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
