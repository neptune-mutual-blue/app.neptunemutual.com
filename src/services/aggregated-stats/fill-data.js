import DateLib from '@/lib/date/DateLib'

const toObj = (data = []) => {
  const obj = {}
  const objectKeys = Object.keys(data[0]).filter(k => { return k !== 'date' })

  data.forEach(x => {
    obj[x.date] = {}
    objectKeys.forEach(key => {
      obj[x.date][key] = x[key]
    })
  })

  return obj
}

export const getFilledData = (dailyData) => {
  const dataObj = toObj(dailyData)
  const startDateUnix = dailyData[0].date

  const objectKeys = Object.keys(dailyData[0]).filter(k => { return k !== 'date' })

  const filledData = []

  let dt = DateLib.fromUnix(startDateUnix)
  const prev = {}
  while (dt < new Date()) {
    const unix = DateLib.toUnix(dt)

    const item = {
      date: unix
    }

    objectKeys.forEach((key) => {
      if (typeof dataObj[unix] !== 'undefined' && typeof dataObj[unix][key] !== 'undefined') {
        item[key] = dataObj[unix][key]

        prev[key] = dataObj[unix][key]
      } else {
        item[key] = prev[key] || '0'
      }
    })

    filledData.push(item)
    dt = DateLib.addDays(dt, 1)
  }

  return filledData
}
