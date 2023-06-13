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

const units = [
  {
    max: 30 * SECOND,
    divisor: 1,
    past1: 'just now',
    pastN: 'just now',
    future1: 'just now',
    futureN: 'just now'
  },
  {
    max: MINUTE,
    divisor: SECOND,
    past1: 'a second ago',
    pastN: '# seconds ago',
    future1: 'in a second',
    futureN: 'in # seconds'
  },
  {
    max: HOUR,
    divisor: MINUTE,
    past1: 'a minute ago',
    pastN: '# minutes ago',
    future1: 'in a minute',
    futureN: 'in # minutes'
  },
  {
    max: DAY,
    divisor: HOUR,
    past1: 'an hour ago',
    pastN: '# hours ago',
    future1: 'in an hour',
    futureN: 'in # hours'
  },
  {
    max: WEEK,
    divisor: DAY,
    past1: 'yesterday',
    pastN: '# days ago',
    future1: 'tomorrow',
    futureN: 'in # days'
  },
  {
    max: 4 * WEEK,
    divisor: WEEK,
    past1: 'last week',
    pastN: '# weeks ago',
    future1: 'in a week',
    futureN: 'in # weeks'
  },
  {
    max: YEAR,
    divisor: MONTH,
    past1: 'last month',
    pastN: '# months ago',
    future1: 'in a month',
    futureN: 'in # months'
  },
  {
    max: 100 * YEAR,
    divisor: YEAR,
    past1: 'last year',
    pastN: '# years ago',
    future1: 'in a year',
    futureN: 'in # years'
  },
  {
    max: 1000 * YEAR,
    divisor: 100 * YEAR,
    past1: 'last century',
    pastN: '# centuries ago',
    future1: 'in a century',
    futureN: 'in # centuries'
  },
  {
    max: Infinity,
    divisor: 1000 * YEAR,
    past1: 'last millennium',
    pastN: '# millennia ago',
    future1: 'in a millennium',
    futureN: 'in # millennia'
  }
]

export const fromNow = (date) => {
  if (!date) {
    return ''
  }

  if (parseInt(date) === 0) {
    return 'Not available'
  }

  if (!(date instanceof Date)) {
    date = DateLib.fromUnix(date)
  }

  const diff =
    Date.now() - (typeof date === 'object' ? date : new Date(date)).getTime()
  const diffAbs = Math.abs(diff)

  for (const unit of units) {
    if (diffAbs > unit.max) {
      continue
    }

    const isFuture = diff < 0
    const x = Math.round(Math.abs(diff) / unit.divisor)

    if (x <= 1) {
      return isFuture ? unit.future1 : unit.past1
    }

    return (isFuture ? unit.futureN : unit.pastN).replace('#', x.toString())
  }
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
