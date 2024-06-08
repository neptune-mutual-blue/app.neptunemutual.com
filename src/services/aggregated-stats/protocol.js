import { SUBGRAPH_API_URLS } from '@/src/config/constants'
import { ChainConfig } from '@/src/config/hardcoded'
import { getSubgraphData } from '@/src/services/subgraph'
import {
  convertFromUnits,
  sumOf
} from '@/utils/bn'
import { getNetworkInfo } from '@/utils/network'

const protocolMonthCoverFeeQuery = `
{
  protocolMonthDatas {
    id
    nonCumulativeCoverFee
  }
}
`

async function getIndividualProtocolMonthData (networkId) {
  const data = await getSubgraphData(
    networkId,
    protocolMonthCoverFeeQuery
  )

  if (!data) { return }

  if (!Array.isArray(data.protocolMonthDatas) || !data.protocolMonthDatas.length) {
    return
  }

  return data.protocolMonthDatas.map(x => {
    return {
      networkId: networkId,
      ...x
    }
  })
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
      obj[val.id] = sumOf(convertFromUnits(val.nonCumulativeCoverFee, ChainConfig[val.networkId]?.stablecoin?.tokenDecimals || 6), obj[val.id] || '0')
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
