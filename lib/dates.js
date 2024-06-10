const getMonthNames = (locale = 'en', short = false) => {
  const baseDate = new Date(Date.UTC(2017, 0, 1)) // just a Monday
  const weekDays = []

  for (let i = 0; i < 12; i++) {
    weekDays.push(baseDate.toLocaleDateString(locale, { month: short ? 'short' : 'long' }))
    baseDate.setMonth(baseDate.getMonth() + 1)
  }

  return weekDays
}

function getMonthsBetweenDates (locale, startDate, endDate) {
  const months = []

  const currentDate = new Date(startDate)

  while (currentDate.getTime() <= endDate) {
    months.push(formatDateByLocale(locale, currentDate))
    currentDate.setMonth(currentDate.getMonth() + 1)
  }

  return months
}

function formatDateByLocale (locale, date, overrides = {}) {
  return new Date(date).toLocaleString(locale, { month: 'short', year: '2-digit', ...overrides })
}

/**
 * Since toUTCString() do not respect the locale, we need to manually format the date
 */
function formatUTCDateByLocale (locale, date, overrides = {}) {
  // get the timestamp of the given date
  const timestamp = new Date(date).getTime()

  // get the timezone offset of the current date with respect to UTC, convert it to milliseconds
  const utcTimeOffset = new Date(timestamp).getTimezoneOffset() * 60000

  // add the utc time offset to the timestamp of given date
  // (if the offset is negative, it will be subtracted from the timestamp)
  const utcTimestamp = timestamp + utcTimeOffset

  const localizedDate = new Date(utcTimestamp).toLocaleString(locale, { month: 'short', year: '2-digit', ...overrides })

  return localizedDate.replace(/\s/g, '-')
}

export {
  formatDateByLocale,
  formatUTCDateByLocale,
  getMonthNames,
  getMonthsBetweenDates
}
