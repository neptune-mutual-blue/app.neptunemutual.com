import {
  useEffect,
  useState
} from 'react'

import {
  ChainLogos,
  NetworkNames
} from '@/lib/connect-wallet/config/chains'
import { getNetworkId } from '@/src/config/environment'
import { getNetworkInfo } from '@/src/hooks/useValidateNetwork'
import { getSubgraphData } from '@/src/services/subgraph'
import { toBN } from '@/utils/bn'

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

const MAIN_NETS = [
  { chainId: 1, name: NetworkNames[1], LogoIcon: ChainLogos[1] },
  { chainId: 42161, name: NetworkNames[42161], LogoIcon: ChainLogos[42161] }
]

const TEST_NET = [
  { chainId: 84531, name: NetworkNames[84531], LogoIcon: ChainLogos[84531] }
]

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

async function getTVLStats ({ chainId, name, LogoIcon }) {
  const { protocols, protocolDayDatas } = await getSubgraphData(chainId, coverFeeQuery)

  const stats = {
    name,
    LogoIcon,
    coverFee: '0',
    tvl: '0',
    capacity: '0'
  }

  if (Array.isArray(protocols) && protocols.length) {
    stats.coverFee = protocols[0].totalCoverFee
    stats.tvl = calculateTvlCover(protocols[0])
  }

  if (Array.isArray(protocols) && protocols.length) {
    stats.capacity = protocolDayDatas[0].totalCapacity
  }

  return stats
}

export async function getInsightsTVLData () {
  const { isMainNet } = getNetworkInfo(getNetworkId())

  const promises = []
  if (isMainNet) {
    MAIN_NETS.forEach(function (item) {
      promises.push(getTVLStats(item))
    })
  } else {
    TEST_NET.forEach(function (item) {
      promises.push(getTVLStats(item))
    })
  }

  const result = await Promise.all(promises)
  return result
}

export const useFetchInsightsTVLStats = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true);

    (async function () {
      try {
        const _data = await getInsightsTVLData()
        setData(_data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return {
    data,
    loading
  }
}
