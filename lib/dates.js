const getMonthNames = (locale = 'en', short = false) => {
  const baseDate = new Date(Date.UTC(2017, 0, 1)) // just a Monday
  const weekDays = []

  for (let i = 0; i < 12; i++) {
    weekDays.push(baseDate.toLocaleDateString(locale, { month: short ? 'short' : 'long' }))
    baseDate.setMonth(baseDate.getMonth() + 1)
  }

  return weekDays
}

function getMonthsBetweenDates (startDate, endDate) {
  const months = []

  const currentDate = new Date(startDate)

  while (currentDate.getTime() <= endDate) {
    months.push(currentDate.toLocaleString('default', { month: 'short' }))
    currentDate.setMonth(currentDate.getMonth() + 1)
  }

  return months
}

export { getMonthNames, getMonthsBetweenDates }
