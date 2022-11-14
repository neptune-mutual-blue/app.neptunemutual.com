import { Radio } from '@/common/Radio/Radio'
import DateLib from '@/lib/date/DateLib'
import { Trans } from '@lingui/macro'
import { useRouter } from 'next/router'
import React from 'react'

const CoveragePeriodStep = ({ value, coverPeriodLabels, approving, purchasing, handleRadioChange, coverMonth, tokenSymbol, feeData }) => {
  const router = useRouter()

  return (
    <div className='mt-12'>
      <p className='font-bold text-center text-h4 text-01052D'><Trans>Select your coverage period</Trans></p>
      <p className='mt-1 mb-8 text-lg text-center text-999BAB'>Don&apos;t worry, you&apos;re not required to make a purchase just yet.</p>
      <div className='flex'>
        <Radio
          label={coverPeriodLabels[0]}
          id='period-1'
          value='1'
          name='cover-period'
          disabled={approving || purchasing}
          onChange={handleRadioChange}
          checked={coverMonth === '1'}
        />
        <Radio
          label={coverPeriodLabels[1]}
          id='period-2'
          value='2'
          name='cover-period'
          disabled={approving || purchasing}
          onChange={handleRadioChange}
          checked={coverMonth === '2'}
        />
        <Radio
          label={coverPeriodLabels[2]}
          id='period-3'
          value='3'
          name='cover-period'
          disabled={approving || purchasing}
          onChange={handleRadioChange}
          checked={coverMonth === '3'}
        />
      </div>
      <div className='w-full px-8 py-6 mt-8 text-center rounded-lg bg-F3F5F7'>
        <div className='flex justify-between'>Your Cover Amount: <span>{value} {tokenSymbol}</span></div>
        <div className='flex justify-between mt-4'>Cover Expires On:
          <span>
            {DateLib.toLongDateFormat(DateLib.fromUnix(feeData.expiryDate), router.locale, 'UTC', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              timeZoneName: 'short'
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CoveragePeriodStep
