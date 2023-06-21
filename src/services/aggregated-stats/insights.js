import {
  useEffect,
  useState
} from 'react'

import { SUBGRAPH_API_URLS } from '@/src/config/constants'
import { ChainConfig } from '@/src/config/hardcoded'
import { useNetwork } from '@/src/context/Network'
import { getSubgraphData } from '@/src/services/subgraph'
import {
  convertFromUnits,
  toBN
} from '@/utils/bn'
import { getNetworkInfo } from '@/utils/network'

const coverFeeQuery = `
{
  protocols {
    totalCoverFee
    totalCoverLiquidityAdded
    totalCoverLiquidityRemoved
    totalFlashLoanFees
  }
  protocolDayDatas(
  orderBy: date, orderDirection:  desc,first: 1) {
    date
    totalCapacity
  }
}              
`

const calculateTvlCover = (data) => {
  const {
    totalCoverLiquidityAdded,
    totalCoverLiquidityRemoved,
    totalFlashLoanFees,
    totalCoverFee
  } = data

  const tvlCover = toBN(totalCoverLiquidityAdded)
    .minus(totalCoverLiquidityRemoved)
    .plus(totalFlashLoanFees)
    .plus(totalCoverFee)
    .toString()

  return tvlCover
}

async function getTVLStats (networkId) {
  const response = await getSubgraphData(networkId, coverFeeQuery)

  if (!response) { return null }

  const { protocols, protocolDayDatas } = response

  const stats = {
    networkId,
    coverFee: '0',
    tvl: '0',
    capacity: '0'
  }

  const stablecoinDecimals = ChainConfig[networkId].stablecoin.tokenDecimals

  if (Array.isArray(protocols) && protocols.length) {
    stats.coverFee = convertFromUnits(protocols[0].totalCoverFee, stablecoinDecimals).toString()
    stats.tvl = convertFromUnits(calculateTvlCover(protocols[0]), stablecoinDecimals).toString()
  }

  if (Array.isArray(protocolDayDatas) && protocolDayDatas.length) {
    stats.capacity = convertFromUnits(protocolDayDatas[0].totalCapacity, stablecoinDecimals).toString()
  }

  return stats
}

export async function getInsightsTVLData (networkId) {
  const { isMainNet } = getNetworkInfo(networkId)

  const promises = []

  for (const id in SUBGRAPH_API_URLS) {
    const match = getNetworkInfo(parseInt(id)).isMainNet === isMainNet

    if (!match) {
      continue
    }

    promises.push(getTVLStats(parseInt(id)))
  }

  const result = await Promise.all(promises)

  return result
}

export const useFetchInsightsTVLStats = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { networkId } = useNetwork()

  useEffect(() => {
    setLoading(true);

    (async function () {
      try {
        const _data = await getInsightsTVLData(networkId)
        setData(_data.filter(Boolean))
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    })()
  }, [networkId])

  return {
    data,
    loading
  }
}
