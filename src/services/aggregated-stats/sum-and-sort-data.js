const { sumOf } = require('@/utils/bn')

const getCumulativeDataObject = (data) => {
  const obj = {}

  data.forEach(arr => {
    const objectKeys = Object.keys(arr[0]).filter(k => k !== 'date')

    arr.forEach(val => {
      objectKeys.forEach(key => {
        if (obj[key]) {
          const sum = sumOf(val[key], obj[key][val.date] || '0')
          obj[key][val.date] = sum
        } else {
          obj[key] = { [val.date]: sumOf(val[key]) }
        }
      })
    })
  })

  return obj
}

const getCumulativeSortedData = (data) => {
  const obj = getCumulativeDataObject(data)

  const finalObject = {}
  Object.keys(obj).forEach(key => {
    const sorted = Object.entries(obj[key]).sort(([a], [b]) => parseInt(a) - parseInt(b))

    finalObject[key] = sorted.reduce((prev, curr) => {
      prev.push({
        date: curr[0],
        value: curr[1]
      })

      return prev
    }, [])
  })

  return finalObject
}

export { getCumulativeSortedData }
