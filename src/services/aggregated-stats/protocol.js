import { SUBGRAPH_API_URLS } from '@/src/config/constants'
import { getFilledData } from '@/src/services/aggregated-stats/fill-data'
import { getSubgraphData } from '@/src/services/subgraph'
import { getNetworkInfo } from '@/src/hooks/useValidateNetwork'
import { getSortedData } from '@/src/services/aggregated-stats/sort-data'

const query = `
{
  protocolDayDatas {
    date
    totalCapacity
    totalLiquidity
    totalCovered
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

  return filledData
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

  const result = await Promise.all(promises)

  const sortedData = getSortedData(result)

  return sortedData
}
