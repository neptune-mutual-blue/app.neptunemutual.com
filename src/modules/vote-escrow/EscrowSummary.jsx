import React from 'react'

import { useRouter } from 'next/router'

import DateLib from '@/lib/date/DateLib'
import { FALLBACK_VENPM_TOKEN_SYMBOL } from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import {
  convertFromUnits,
  convertToUnits
} from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { fromNow } from '@/utils/formatter/relative-time'

const TOTAL_LOCKED = 250000

const EscrowSummary = ({ veNPMBalance, unlockTimestamp, className = '' }) => {
  const router = useRouter()
  const { NPMTokenDecimals, NPMTokenSymbol } = useAppConstants()

  const formattedUnlockDate = DateLib.toLongDateFormat(DateLib.fromUnix(unlockTimestamp), router.locale)

  const totalLocked = convertToUnits(TOTAL_LOCKED, NPMTokenDecimals).toString()
  const formattedTotalLocked = formatCurrency(convertFromUnits(totalLocked, NPMTokenDecimals), router.locale, NPMTokenSymbol, true)
  const formattedVeNPMBalance = formatCurrency(convertFromUnits(veNPMBalance, NPMTokenDecimals), router.locale, FALLBACK_VENPM_TOKEN_SYMBOL, true)

  return (
    <div className={classNames('rounded-lg p-6', className)}>
      <div className='flex flex-col justify-between gap-4 mb-4 sm:flex-row'>
        <div>
          <div className='mb-1 text-sm font-semibold text-999BAB'>Total Vote-Locked</div>
          <div className='text-xl' title={formattedTotalLocked.long}>{formattedTotalLocked.short}</div>
        </div>
        <div>
          <div className='mb-1 text-sm font-semibold text-999BAB'>Max Boost</div>
          <div className='text-xl'>4x</div>
        </div>
        <div>
          <div className='mb-1 text-sm font-semibold text-999BAB'>Average Lock</div>
          <div className='text-xl'>52 weeks</div>
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='flex justify-between text-sm'>
          <span>Your veNPM Balance:</span>
          <span className='font-semibold' title={formattedVeNPMBalance.long}>{formattedVeNPMBalance.short}</span>
        </div>
        <div className='flex justify-between text-sm'>
          <span>Your Unlock Timestamp:</span> <span className='font-semibold' title={formattedUnlockDate}>{unlockTimestamp !== '0' ? fromNow(unlockTimestamp) : 'N/A'}</span>
        </div>
        <div className='flex justify-between text-sm'>
          <span>Premature Unlock Penalty:</span> <span className='font-semibold'>25%</span>
        </div>
      </div>
    </div>
  )
}

export default EscrowSummary
