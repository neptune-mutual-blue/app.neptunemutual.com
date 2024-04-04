import React from 'react'

import { useRouter } from 'next/router'

import DateLib from '@/lib/date/DateLib'
import { useVoteEscrowStats } from '@/modules/vote-escrow/useVoteEscrowStats'
import { PREMATURE_UNLOCK_PENALTY_FRACTION } from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import { convertFromUnits } from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { fromNow } from '@/utils/formatter/relative-time'

const EscrowSummary = ({ veNPMBalance, veNPMTokenSymbol, unlockTimestamp, className = '' }) => {
  const router = useRouter()
  const { NPMTokenDecimals, NPMTokenSymbol } = useAppConstants()
  const { data } = useVoteEscrowStats()

  const formattedUnlockDate = DateLib.toLongDateFormat(DateLib.fromUnix(unlockTimestamp), router.locale)

  const formattedTotalLocked = formatCurrency(convertFromUnits(data.totalVoteLocked, NPMTokenDecimals), router.locale, NPMTokenSymbol, true)
  const formattedVeNPMBalance = formatCurrency(convertFromUnits(veNPMBalance, NPMTokenDecimals), router.locale, veNPMTokenSymbol, true)

  return (
    <div className={classNames('rounded-lg p-6', className)}>
      <div className='flex flex-col justify-between gap-4 mb-4 sm:flex-row'>
        <div>
          <div className='mb-1 text-sm font-semibold text-999BAB'>Total Vote-Locked</div>
          <div className='text-xl' title={formattedTotalLocked.long}>{formattedTotalLocked.short}</div>
        </div>
        <div>
          <div className='mb-1 text-sm font-semibold text-999BAB'>Max Boost</div>
          {/* Hardcoded */}
          <div className='text-xl'>4x</div>
        </div>
        <div>
          <div className='mb-1 text-sm font-semibold text-999BAB'>Average Lock</div>
          <div className='text-xl' title={data.averageLock ? parseFloat(data.averageLock).toFixed(6) : 'Not Available'}>
            {data.averageLock ? <>{parseFloat(data.averageLock).toFixed(2)} weeks</> : 'N/A'}
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='flex justify-between text-sm'>
          <span>Your veNPM Balance:</span>
          <span className='font-semibold' title={formattedVeNPMBalance.long}>{formattedVeNPMBalance.short}</span>
        </div>
        <div className='flex justify-between text-sm'>
          <span>Your Unlock Timestamp:</span> <span className='font-semibold' title={formattedUnlockDate}>{unlockTimestamp !== '0' ? fromNow(unlockTimestamp, router.locale) : 'N/A'}</span>
        </div>
        <div className='flex justify-between text-sm'>
          <span>Premature Unlock Penalty:</span> <span className='font-semibold'>{formatPercent(PREMATURE_UNLOCK_PENALTY_FRACTION)}</span>
        </div>
      </div>
    </div>
  )
}

export default EscrowSummary
