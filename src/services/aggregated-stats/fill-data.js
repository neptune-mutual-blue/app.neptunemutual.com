import DateLib from '@/lib/date/DateLib'

const toObj = (data = []) => {
  const obj = {}

  data.forEach(x => {
    obj[x.date] = x.totalCapacity
  })

  return obj
}

export const getFilledData = (dailyData) => {
  const dataObj = toObj(dailyData)
  const startDateUnix = dailyData[0].date

  const filledData = []

  let dt = DateLib.fromUnix(startDateUnix)
  let prev = '0'
  while (dt < new Date()) {
    const unix = DateLib.toUnix(dt)
    if (typeof dataObj[unix] !== 'undefined') {
      filledData.push({
        date: unix,
        totalCapacity: dataObj[unix]
      })
      prev = dataObj[unix]
    } else {
      filledData.push({
        date: unix,
        totalCapacity: prev
      })
    }

    filledData.push()
    dt = DateLib.addDays(dt, 1)
  }

  return filledData
}
