import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { CustomRadio } from '@/common/Radio/Radio'

import { getMonthNames } from '@/lib/dates'

const getMonthEnd = (month, fullYear) => {
  const d = new Date(fullYear, month + 1, 0)
  return d.getDate()
}

const getCoveragePeriodLabels = (locale) => {
  const now = new Date()
  const day = now.getUTCDate()
  const currentMonthIndex = now.getUTCMonth()
  const fullYear = now.getUTCFullYear()

  const monthNames = getMonthNames(locale, true)

  // Note: Refer `getExpiryDateInternal` in protocol
  // https://github.com/neptune-mutual-blue/protocol/blob/a98fcce3657d80814f2aca67a4a8a3534ff8da2d/contracts/libraries/CoverUtilV1.sol#L599-L613
  if (day >= 25) {
    return [
      monthNames[(currentMonthIndex + 1) % 12] + getMonthEnd((currentMonthIndex + 1), fullYear),
      monthNames[(currentMonthIndex + 2) % 12] + getMonthEnd((currentMonthIndex + 2), fullYear),
      monthNames[(currentMonthIndex + 3) % 12] + getMonthEnd((currentMonthIndex + 3), fullYear)
    ]
  }

  return [
    monthNames[(currentMonthIndex + 0) % 12] + ' ' + getMonthEnd((currentMonthIndex + 0), fullYear),
    monthNames[(currentMonthIndex + 1) % 12] + ' ' + getMonthEnd((currentMonthIndex + 1), fullYear),
    monthNames[(currentMonthIndex + 2) % 12] + ' ' + getMonthEnd((currentMonthIndex + 2), fullYear)
  ]
}

export const DateRangePicker = ({ approving, purchasing }) => {
  const [coverMonth, setCoverMonth] = useState('')

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

  const router = useRouter()
  const coverPeriodLabels = getCoveragePeriodLabels(router.locale)

  const [radioProgress, setRadioProgress] = useState(0)

  const handleRadioChange = (e) => {
    setCoverMonth(e.target.value)
  }

  function handleClick (e) {
    handleRadioChange(e)
  }

  return (
    <div className='relative flex pb-4'>
      <div className='absolute h-2 bg-999BAB  bg-opacity-30 top-1.5' style={{ width: 'calc(100% - 20px)' }} />
      <div className='absolute h-2 bg-4e7dd9 border-l-white border-l-2 border-r-white border-r-2 top-1.5' style={{ width: `calc(0% + ${radioProgress}%)` }} />

      <CustomRadio
        label={`${coverPeriodLabels[0]}`}
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
        label={`${coverPeriodLabels[1]}`}
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
        label={`${coverPeriodLabels[2]}`}
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
  )
}
