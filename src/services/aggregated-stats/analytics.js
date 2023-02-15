import { useState, useEffect } from 'react'
import { getNetworkId } from '@/src/config/environment'
import { getNetworkInfo } from '@/src/hooks/useValidateNetwork'
import { getSubgraphData } from '@/src/services/subgraph'

import EthLogo from 'lib/connect-wallet/components/logos/EthLogo.jsx'
import ArbitrumLogo from 'lib/connect-wallet/components/logos/ArbitrumLogo.jsx'
import AvaxLogo from '@/lib/connect-wallet/components/logos/AvaxLogo'
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
  { chainId: 1, name: 'Ethereum', LogoIcon: EthLogo },
  { chainId: 42161, name: 'Arbitrum', LogoIcon: ArbitrumLogo }
]

const TEST_NET = [
  { chainId: 43113, name: 'Avalance Fuji', LogoIcon: AvaxLogo }
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
  const coverFeeData = await getSubgraphData(chainId, coverFeeQuery)

  return {
    coverFee: coverFeeData.protocols[0].totalCoverFee,
    capacity: coverFeeData.protocolDayDatas[0].totalCapacity,
    tvl: calculateTvlCover(coverFeeData.protocols[0]),
    name,
    LogoIcon
  }
}

export async function getAnalyticsTVLData () {
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

export const useFetchAnalyticsTVLStats = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true);

    (async function () {
      try {
        const _data = await getAnalyticsTVLData()
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
