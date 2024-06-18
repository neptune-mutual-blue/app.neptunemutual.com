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

function formatDateByLocale (locale = 'en', date, overrides = {}) {
  return new Date(date).toLocaleString(locale, { month: 'short', year: '2-digit', ...overrides })
}

export { formatDateByLocale, getMonthNames, getMonthsBetweenDates }
