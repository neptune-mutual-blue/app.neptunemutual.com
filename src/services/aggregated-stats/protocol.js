import { SUBGRAPH_API_URLS } from '@/src/config/constants'
import { ChainConfig } from '@/src/config/hardcoded'
import { getFilledData } from '@/src/services/aggregated-stats/fill-data'
import {
  getCumulativeSortedData
} from '@/src/services/aggregated-stats/sum-and-sort-data'
import { getSubgraphData } from '@/src/services/subgraph'
import {
  convertFromUnits,
  sumOf
} from '@/utils/bn'
import { getNetworkInfo } from '@/utils/network'

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

const protocolMonthCoverFeeQuery = `
{
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

  if (!data) { return }

  if (!Array.isArray(data.protocolDayDatas) || !data.protocolDayDatas.length) {
    return
  }

  const stablecoinDecimals = ChainConfig[networkId].stablecoin.tokenDecimals
  const filledData = getFilledData(data.protocolDayDatas.map(x => {
    return {
      ...x,
      totalCapacity: convertFromUnits(x.totalCapacity, stablecoinDecimals).toString(),
      totalLiquidity: convertFromUnits(x.totalLiquidity, stablecoinDecimals).toString(),
      totalCovered: convertFromUnits(x.totalCovered, stablecoinDecimals).toString()
    }
  }))

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

  const sortedData = getCumulativeSortedData(result)

  return sortedData
}

async function getIndividualProtocolMonthData (networkId) {
  const data = await getSubgraphData(
    networkId,
    protocolMonthCoverFeeQuery
  )

  if (!data) { return }

  if (!Array.isArray(data.protocolMonthDatas) || !data.protocolMonthDatas.length) {
    return
  }

  return data.protocolMonthDatas
}

export async function getGroupedProtocolMonthData (networkId) {
  const { isMainNet } = getNetworkInfo(networkId)

  const promises = []

  for (const id in SUBGRAPH_API_URLS) {
    const match = getNetworkInfo(parseInt(id)).isMainNet === isMainNet

    if (!match) {
      continue
    }

    promises.push(getIndividualProtocolMonthData(parseInt(id)))
  }

  const result = await Promise.all(promises)

  const obj = {}

  result.forEach(arr => {
    if (!Array.isArray(arr)) { return }

    arr.forEach(val => {
      obj[val.id] = sumOf(val.nonCumulativeCoverFee, obj[val.id] || '0')
    })
  })

  const sorted = Object.entries(obj).sort(([a], [b]) => { return parseInt(a) - parseInt(b) })

  return sorted.reduce((prev, curr) => {
    prev.push({
      id: curr[0],
      nonCumulativeCoverFee: curr[1]
    })

    return prev
  }, [])
}
