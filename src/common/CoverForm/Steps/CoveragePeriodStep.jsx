import { CustomRadio } from '@/common/Radio/Radio'
import DateLib from '@/lib/date/DateLib'
import { Trans } from '@lingui/macro'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const CoveragePeriodStep = ({ value, coverPeriodLabels, approving, purchasing, handleRadioChange, coverMonth, tokenSymbol, feeData }) => {
  const router = useRouter()

  const [radioProgress, setRadioProgress] = useState(0)

  function handleClick (e) {
    handleRadioChange(e)
  }

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
    <div className='mt-6'>
      <p className='font-bold text-center capitalize text-receipt-info text-01052D'><Trans>Select your coverage period</Trans></p>
      <p className='mt-1 mb-8 text-lg text-center text-999BAB'>Don&apos;t worry, you&apos;re not required to make a purchase just yet.</p>
      <div className='relative flex'>
        <div className='absolute h-2 bg-999BAB  bg-opacity-30 top-1.5' style={{ width: 'calc(100% - 20px)' }} />
        <div className='absolute h-2 bg-4e7dd9 border-l-white border-l-2 border-r-white border-r-2 top-1.5' style={{ width: `calc(0% + ${radioProgress}%)` }} />

        <CustomRadio
          label={`${coverPeriodLabels[0].substr(0, 3)} 31`}
          className='!items-start flex-col'
          labelClass='mt-2'
          id='period-1'
          value='1'
          name='cover-period-1'
          disabled={approving || purchasing}
          onChange={handleClick}
          onClick={handleClick}
          checked={parseInt(coverMonth) >= 1}
        />
        <CustomRadio
          label={`${coverPeriodLabels[1].substr(0, 3)} 31`}
          className='!items-center flex-col'
          labelClass='mt-2'
          id='period-2'
          value='2'
          name='cover-period-2'
          disabled={approving || purchasing}
          onChange={handleClick}
          onClick={handleClick}
          checked={parseInt(coverMonth) >= 2}
        />
        <CustomRadio
          label={`${coverPeriodLabels[2].substr(0, 3)} 31`}
          className='!items-end flex-col'
          labelClass='mt-2'
          id='period-3'
          value='3'
          name='cover-period-3'
          disabled={approving || purchasing}
          onChange={handleClick}
          onClick={handleClick}
          checked={parseInt(coverMonth) >= 3}
        />
      </div>
      <div className='w-full px-2 py-6 text-center rounded-lg mt-11 md:px-8 bg-F3F5F7'>
        <div className='flex justify-between font-semibold uppercase'><span className='w-1/2 text-left'>Your Cover Amount: </span><span className='w-1/2 font-normal text-right'>{value} {tokenSymbol}</span></div>
        <div className='flex justify-between mt-4 font-semibold uppercase'><span className='w-1/2 text-left'>Cover Expires On:</span>
          <span className='font-normal text-right fw-1/2'>
            {DateLib.toLongDateFormat(feeData.expiryDate, router.locale, 'UTC', {
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
