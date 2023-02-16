import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { classNames } from '@/utils/classnames'

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

export const DateRangePicker = ({ handleRadioChange, coverMonth, disabled }) => {
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

  function handleClick (e) {
    handleRadioChange(e)
  }
  return (
    <div className='relative flex'>
      <div className='absolute h-2 bg-999BAB  bg-opacity-30 top-1.5 z-5' style={{ width: 'calc(100% - 20px)' }} />
      <div className='absolute h-2 bg-4e7dd9 border-l-white border-l-2 z-5 border-r-white border-r-2 top-1.5' style={{ width: `calc(0% + ${radioProgress}%)` }} />
      <DateRangerPickerRadio
        label={`${coverPeriodLabels[0]}`}
        className='!items-start flex-col w-23 h-23'
        labelClass='mt-2'
        id='period-1'
        value='1'
        name='cover-period-1'
        disabled={disabled}
        onChange={handleClick}
        onClick={handleClick}
        checked={parseInt(coverMonth) >= 1}
      />
      <DateRangerPickerRadio
        label={`${coverPeriodLabels[1]}`}
        className='!items-center flex-col'
        labelClass='mt-2'
        id='period-2'
        value='2'
        name='cover-period-2'
        disabled={disabled}
        onChange={handleClick}
        onClick={handleClick}
        checked={parseInt(coverMonth) >= 2}
      />
      <DateRangerPickerRadio
        label={`${coverPeriodLabels[2]}`}
        className='!items-end flex-col'
        labelClass='mt-2'
        id='period-3'
        value='3'
        name='cover-period-3'
        disabled={disabled}
        onChange={handleClick}
        onClick={handleClick}
        checked={parseInt(coverMonth) >= 3}
      />
    </div>
  )
}

const DateRangerPickerRadio = ({ label, id, disabled, className = '', labelClass = '', ...rest }) => {
  return (
    <div
      className={classNames(
        'flex items-center w-full flex-1 z-5',
        className,
        disabled && 'cursor-not-allowed'
      )}
    >
      <input
        className={classNames(
          'cursor-pointer relative appearance-none rounded-full w-6 h-6 bg-transparent border border-B0C4DB z-20 focus:outline-none focus:border-B0C4DB m-0 p-0',
          disabled && 'cursor-not-allowed'
        )}
        type='radio'
        id={id}
        disabled={disabled}
        {...rest}
      />

      <div className={classNames('w-6 h-6 bg-EEEEEE rounded-full z-5 absolute flex align-middle justify-center')}>  {rest.checked && <div className={classNames('w-3 h-3 bg-4e7dd9 rounded-full my-auto')} />} </div>

      <label
        className={classNames(
          'cursor-pointer text-xs uppercase flex-1 text-01052D', labelClass,
          disabled && 'cursor-not-allowed'
        )}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  )
}
