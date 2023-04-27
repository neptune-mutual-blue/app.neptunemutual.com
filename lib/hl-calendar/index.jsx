import { useState } from 'react'

import { useRouter } from 'next/router'

import ChevronLeftLgIcon from '@/icons/ChevronLeftLgIcon'
import ChevronRightLgIcon from '@/icons/ChevronRightLgIcon'
import { getMonthNames } from '@/lib/dates'
import { t } from '@lingui/macro'

// HlCalendar - Highlight Calendar
export const HlCalendar = ({ startDate, endDate }) => {
  const router = useRouter()
  const { month, year } = getPrimaryMonthYear(startDate, endDate)

  const [calendarState, setCalendarState] = useState({ month, year })

  const monthNames = getMonthNames(router.locale)

  const allDates = addWeekDatesAfter(
    addWeekDatesBefore(
      getMonth(calendarState.month, calendarState.year, startDate)
    )
  )

  const arr = chunk(allDates, 7)
  const weekDays = getWeekDays('en')

  const handlePrev = () => {
    setCalendarState((prev) => {
      const _month = prev.month === 0 ? 11 : prev.month - 1
      const _year = prev.month === 0 ? prev.year - 1 : prev.year
      return { month: _month, year: _year }
    })
  }

  const handleNext = () => {
    setCalendarState((prev) => {
      const _month = prev.month === 11 ? 0 : prev.month + 1
      const _year = prev.month === 11 ? prev.year + 1 : prev.year
      return { month: _month, year: _year }
    })
  }

  return (
    <div className='mt-8'>
      <div className='flex items-center justify-between'>
        <div className='text-sm'>
          {monthNames[calendarState.month]} {calendarState.year}
        </div>
        <div className='flex'>
          <button
            aria-label='Prev'
            className={classNames(
              'p-1 text-black rounded-1 mr-2 bg-EEEEEE hover:bg-DEEAF6'
            )}
            onClick={handlePrev}
          >
            <span className='sr-only'>{t`Previous`}</span>
            <ChevronLeftLgIcon aria-hidden='true' className='w-3 h-3 text-lg' />
          </button>
          <button
            aria-label='Prev'
            className={classNames(
              'p-1 text-black rounded-1 mr-2 bg-EEEEEE hover:bg-DEEAF6'
            )}
            onClick={handleNext}
          >
            <span className='sr-only'>{t`Next`}</span>
            <ChevronRightLgIcon
              aria-hidden='true'
              className='w-3 h-3 text-lg'
            />
          </button>
        </div>
      </div>
      <table className='text-xxs' aria-hidden='true' data-testid='hlcalendar'>
        <thead>
          <tr>
            {weekDays.map((x) => (
              <td
                key={x}
                title={x}
                className='p-3 font-medium text-center lowercase align-middle'
              >
                {x[0]}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {arr.map((x, _i) => (
            <tr key={_i}>
              {x.map((y, _j) => {
                // const isStart = startDate.getTime() === y.getTime();
                // const isEnd = endDate.getTime() === y.getTime();
                const isInsideRange =
                  startDate.getTime() <= y.getTime() &&
                  endDate.getTime() >= y.getTime()
                const isDifferentMonth = calendarState.month !== y.getMonth()
                const isToday =
                  y.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)

                return (
                  <td
                    key={_j}
                    className={classNames(
                      'p-2 text-center align-middle',
                      // isStart && "rounded-l-lg",
                      // isEnd && "rounded-r-lg",
                      isInsideRange && 'bg-DEEAF6'
                    )}
                  >
                    <span
                      className={classNames(
                        'px-1.5 py-2 block',
                        isDifferentMonth && 'opacity-40',
                        isToday && 'rounded-full bg-4E7DD9 text-white'
                      )}
                    >
                      {y.getDate()}
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function addWeekDatesBefore (dates) {
  /* istanbul ignore next */
  if (dates.length === 0) {
    return []
  }

  const datesBeforeStart = [...dates]

  function shouldContinue (firstDate) {
    // Sunday - Saturday : 0 - 6
    return firstDate.getDay() > 0
  }

  function getPreviousDate (date) {
    const copiedDate = getClone(date)
    copiedDate.setDate(date.getDate() - 1)
    return copiedDate
  }

  while (shouldContinue(datesBeforeStart[0])) {
    const previousDate = getPreviousDate(datesBeforeStart[0])
    datesBeforeStart.unshift(previousDate)
  }

  return datesBeforeStart
}

function addWeekDatesAfter (dates) {
  /* istanbul ignore next */
  if (dates.length === 0) {
    return []
  }

  const datesAfterEnd = [...dates]

  function shouldContinue (lastDate) {
    // Sunday - Saturday : 0 - 6
    return lastDate.getDay() < 6
  }

  function getNextDate (date) {
    const copiedDate = getClone(date)
    copiedDate.setDate(date.getDate() + 1)
    return copiedDate
  }

  while (shouldContinue(datesAfterEnd[datesAfterEnd.length - 1])) {
    const nextDate = getNextDate(datesAfterEnd[datesAfterEnd.length - 1])
    datesAfterEnd.push(nextDate)
  }

  return datesAfterEnd
}

function getPrimaryMonthYear (startDate, endDate) {
  const startMonth = startDate.getMonth() // January - December : 0 - 11
  const endMonth = endDate.getMonth() // January - December : 0 - 11

  if (startMonth === endMonth) {
    return {
      month: startMonth,
      year: startDate.getFullYear()
    }
  }

  const daysOfMonth = {
    [startMonth]: 0,
    [endMonth]: 1
  }

  // calculates the day difference between startDate and endDate
  const cursorDate = getClone(startDate)
  while (cursorDate.getDate() !== endDate.getDate()) {
    daysOfMonth[cursorDate.getMonth()] += 1
    cursorDate.setDate(cursorDate.getDate() + 1)
  }

  // no idea how to reach this part of the code
  // daysOfMonth[startMonth] > daysOfMonth[endDate]
  return {
    month:
      daysOfMonth[startMonth] > daysOfMonth[endDate] ? startMonth : endMonth,

    year:
      daysOfMonth[startMonth] > daysOfMonth[endDate]
        ? startDate.getFullYear()
        : endDate.getFullYear()
  }
}

function getClone (date) {
  return new Date(date.getTime())
}

/**
 * @param {number} month the month number, 0 based
 * @param {number} year the year  not zero based, required to account for leap years
 * @return {Date[]} List with date objects for each day of the month
 */
function getMonth (month, year, refDate) {
  // Using refDate to match the time and timezone, and only modifying the date,month,year
  const date = getClone(refDate)
  date.setFullYear(year)
  date.setMonth(month)
  date.setDate(1)

  const days = []

  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }

  return days
}

function chunk (arrayToSplit, chunkSize) {
  const chunks = []

  for (let i = 0; i < arrayToSplit.length; i += chunkSize) {
    const tempArray = arrayToSplit.slice(i, i + chunkSize)
    chunks.push(tempArray)
  }

  return chunks
}

function getWeekDays (locale) {
  const baseDate = new Date(Date.UTC(2017, 0, 1)) // just a Monday
  const weekDays = []

  for (let i = 0; i < 7; i++) {
    weekDays.push(baseDate.toLocaleDateString(locale, { weekday: 'long' }))
    baseDate.setDate(baseDate.getDate() + 1)
  }

  return weekDays
}

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}
