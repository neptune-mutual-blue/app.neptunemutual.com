import DateLib from '@/lib/date/DateLib'
import { useNetwork } from '@/src/context/Network'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'
import { useState, useEffect } from 'react'

const toObj = (data = []) => {
  const obj = {}

  data.forEach(x => {
    obj[x.date] = x.totalLiquidity
  })

  return obj
}

const getFilledData = (dailyData) => {
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
        totalLiquidity: dataObj[unix]
      })
      prev = dataObj[unix]
    } else {
      filledData.push({
        date: unix,
        totalLiquidity: prev
      })
    }

    filledData.push()
    dt = DateLib.addDays(dt, 1)
  }

  return filledData
}

const getQuery = () => {
  return `
  {
    protocolDayDatas {
      date
      totalLiquidity
    }
  }              
`
}

export const useProtocolDayData = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const { networkId } = useNetwork()
  const fetchProtocolDayData = useSubgraphFetch('useProtocolDayData')

  useEffect(() => {
    setLoading(true)

    fetchProtocolDayData(networkId, getQuery())
      .then((_data) => {
        if (!_data) return

        if (!Array.isArray(_data.protocolDayDatas) || !_data.protocolDayDatas.length) {
          return
        }

        const filledData = getFilledData(_data.protocolDayDatas)

        setData(filledData)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [fetchProtocolDayData, networkId])

  return {
    data,
    loading
  }
}
