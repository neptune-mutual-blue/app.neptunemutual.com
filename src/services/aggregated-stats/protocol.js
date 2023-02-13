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

  protocolMonthDatas {
    id
    nonCumulativeCoverFee
  }
}              
`

async function getIndividualProtocolDayData (networkId) {
  const data = await getSubgraphData(
    networkId,
    query
  )

  if (!data) return

  if (!Array.isArray(data.protocolDayDatas) || !data.protocolDayDatas.length) {
    return
  }

  const filledData = getFilledData(data.protocolDayDatas)

  return { protocolDayDatas: filledData, protocolMonthDatas: data.protocolMonthDatas }
}

export async function getGroupedProtocolDayData (networkId) {
  const { isMainNet } = getNetworkInfo(networkId)

  const promises = []

  for (const id in SUBGRAPH_API_URLS) {
    const match = getNetworkInfo(parseInt(id)).isMainNet === isMainNet

    if (!match) {
      continue
    }

    promises.push(getIndividualProtocolDayData(parseInt(id)))
  }

  const results = await Promise.all(promises)
  const dayResults = results.map(res => res.protocolDayDatas)
  const monthResults = results[0].protocolMonthDatas

  const obj = {}

  dayResults.forEach(arr => {
    arr.forEach(val => {
      obj[val.date] = sumOf(val.totalCapacity, obj[val.date] || '0')
    })
  })

  const sorted = Object.entries(obj).sort(([a], [b]) => parseInt(a) - parseInt(b))

  return {
    groupedProtocolDayData: sorted.reduce((prev, curr) => {
      prev.push({
        date: curr[0],
        totalCapacity: curr[1]
      })

      return prev
    }, []),
    groupedProtocolMonthData: monthResults
  }
}
