import { Radio } from '@/common/Radio/Radio'
import DateLib from '@/lib/date/DateLib'
import { Trans } from '@lingui/macro'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const CoveragePeriodStep = ({ value, coverPeriodLabels, approving, purchasing, handleRadioChange, coverMonth, tokenSymbol, feeData }) => {
  const router = useRouter()

  const [radioProgress, setRadioProgress] = useState(0)

  useEffect(() => {
    if (coverMonth === '3') {
      setRadioProgress(100)
    }
    if (coverMonth === '2') {
      setRadioProgress(50)
    }
    if (coverMonth === '1') {
      setRadioProgress(0)
    }
  }, [coverMonth])

  return (
    <div className='mt-12'>
      <p className='font-bold text-center capitalize text-h4 text-01052D'><Trans>Select your coverage period</Trans></p>
      <p className='mt-1 mb-8 text-lg text-center text-999BAB'>Don&apos;t worry, you&apos;re not required to make a purchase just yet.</p>
      <div className='relative flex'>
        <div className='absolute h-2 bg-999BAB bg-opacity-30 top-1.5' style={{ width: 'calc(100% - 20px)' }} />
        <div className='absolute h-2 bg-4e7dd9 top-1.5' style={{ width: `calc(0% + ${radioProgress}%)` }} />

        <Radio
          label={`${coverPeriodLabels[0].substr(0, 3)} 31`}
          className='!items-start flex-col'
          labelClass='mt-2'
          id='period-1'
          value='1'
          name='cover-period'
          disabled={approving || purchasing}
          onChange={handleRadioChange}
          checked={coverMonth === '1'}
        />
        <Radio
          label={`${coverPeriodLabels[1].substr(0, 3)} 31`}
          className='!items-center flex-col'
          labelClass='mt-2'
          id='period-2'
          value='2'
          name='cover-period'
          disabled={approving || purchasing}
          onChange={handleRadioChange}
          checked={coverMonth === '2'}
        />
        <Radio
          label={`${coverPeriodLabels[2].substr(0, 3)} 31`}
          className='!items-end flex-col'
          labelClass='mt-2'
          id='period-3'
          value='3'
          name='cover-period'
          disabled={approving || purchasing}
          onChange={handleRadioChange}
          checked={coverMonth === '3'}
        />
      </div>
      <div className='w-full px-8 py-6 mt-8 text-center rounded-lg bg-F3F5F7'>
        <div className='flex justify-between font-semibold uppercase'>Your Cover Amount: <span className='font-normal'>{value} {tokenSymbol}</span></div>
        <div className='flex justify-between mt-4 font-semibold uppercase'>Cover Expires On:
          <span className='font-normal'>
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
