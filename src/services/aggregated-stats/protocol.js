import { SUBGRAPH_API_URLS } from '@/src/config/constants'
import { getFilledData } from '@/src/services/aggregated-stats/fill-data'
import { getSubgraphData } from '@/src/services/subgraph'
import { sumOf } from '@/utils/bn'
import { getNetworkInfo } from '@/src/hooks/useValidateNetwork'

const query = `
{
  protocolDayDatas {
    date
    totalCapacity
  }
}              
`

async function getIndividualProtocolDayData (networkId) {
  const data = await getSubgraphData(
    networkId,
    query
  )

  console.log(data, networkId)

  if (!data) return

  if (!Array.isArray(data.protocolDayDatas) || !data.protocolDayDatas.length) {
    return
  }

  const filledData = getFilledData(data.protocolDayDatas)

  return filledData
}

export async function getGroupedProtocolDayData (networkId) {
  const { isMainNet } = getNetworkInfo(networkId)

  const promises = []

  for (const id in SUBGRAPH_API_URLS) {
    if (isMainNet && getNetworkInfo(parseInt(id)).isMainNet) {
      promises.push(getIndividualProtocolDayData(parseInt(id)))
    }

    if (!isMainNet && !getNetworkInfo(parseInt(id)).isMainNet) {
      promises.push(getIndividualProtocolDayData(parseInt(id)))
    }
  }

  const result = await Promise.all(promises)

  const obj = {}

  result.forEach(arr => {
    arr.forEach(val => {
      obj[val.date] = sumOf(val.totalCapacity, obj[val.date] || '0')
    })
  })

  const sorted = Object.entries(obj).sort(([a], [b]) => parseInt(a) - parseInt(b))

  return sorted.reduce((prev, curr) => {
    prev.push({
      date: curr[0],
      totalCapacity: curr[1]
    })

    return prev
  }, [])
}
