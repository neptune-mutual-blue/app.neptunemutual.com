/**
 * Human readable elapsed or remaining time (example: 3 minutes ago)
 * @param  {Date|Number|String} date A Date object, timestamp or string parsable with Date.parse()
 * @return {string} Human readable elapsed or remaining time
 * @author github.com/victornpb
 * @see https://stackoverflow.com/a/67338038/938822
 */

import DateLib from '@/lib/date/DateLib'
import { getMonthNames } from '@/lib/dates'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY
const YEAR = 365 * DAY

/**
 * @type {Array<{unit: Intl.RelativeTimeFormatUnit, divisor: number}>}
 */
const units = [
  {
    unit: 'year',
    divisor: YEAR
  },
  {
    unit: 'month',
    divisor: MONTH
  },
  {
    unit: 'week',
    divisor: WEEK
  },
  {
    unit: 'day',
    divisor: DAY
  },
  {
    unit: 'hour',
    divisor: HOUR
  },
  {
    unit: 'minute',
    divisor: MINUTE
  },
  {
    unit: 'second',
    divisor: SECOND
  }
]

export const fromNow = (date, locale = 'en') => {
  if (!date) {
    return ''
  }

  if (typeof date === 'string' && parseInt(date) === 0) {
    return 'Not available'
  }

  if (!(date instanceof Date) && ['string', 'number'].includes(typeof date)) {
    date = DateLib.fromUnix(date)
  }

  const diff = Date.now() - (typeof date === 'object' ? date : new Date(date)).getTime()
  const diffAbs = Math.abs(diff)

  const matchedUnit = units.find(unit => { return (diffAbs / unit.divisor) >= 1 })

  if (matchedUnit) {
    const { divisor, unit } = matchedUnit
    let value = Math.round(diff / divisor)
    value = value > 0 ? -1 * value : Math.abs(value)

    const rtf = new Intl.RelativeTimeFormat(locale, {
      numeric: 'auto'
    })

    return rtf.format(value, unit)
  }

  return 'just now'
}

export const getUtcFormatString = (timestamp, locale = 'en') => {
  const date = new Date(parseInt(timestamp) * 1000)
  const time = `${date.toUTCString().match(/\s\d{2}:\d{2}/)[0].trim()} UTC`

  const monthNames = getMonthNames(locale)
  const monthName = monthNames[date.getUTCMonth()]
  const exactDate = String(date.getUTCDate()).padStart(2, '0')
  const fullYear = date.getUTCFullYear()
  const fullDate = `${monthName} ${exactDate}, ${fullYear}`

  return [time, fullDate].join(' | ')
}
