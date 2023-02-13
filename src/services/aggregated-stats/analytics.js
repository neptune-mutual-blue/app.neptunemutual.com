import { useState, useEffect } from 'react'
import { getNetworkId } from '@/src/config/environment'
import { getNetworkInfo } from '@/src/hooks/useValidateNetwork'
import { getSubgraphData } from '@/src/services/subgraph'

import EthLogo from 'lib/connect-wallet/components/logos/EthLogo.jsx'
import ArbitrumLogo from 'lib/connect-wallet/components/logos/ArbitrumLogo.jsx'

const coverFeeQuery = `
{
  protocols {
    totalCoverFee
  }
  protocolDayDatas(
  orderBy: date, orderDirection:  desc,first: 1) {
    date
    totalCapacity
  }
}              
`

const TEST_NET = [
  { chainId: 1, name: 'Ethereum', LogoIcon: EthLogo },
  { chainId: 42161, name: 'Arbitrum', LogoIcon: ArbitrumLogo }
]

async function getTVLStats ({ chainId, name, LogoIcon }) {
  const coverFeeData = await getSubgraphData(chainId, coverFeeQuery)
  return {
    coverFee: coverFeeData.protocols[0].totalCoverFee,
    capacity: coverFeeData.protocolDayDatas[0].totalCapacity,
    name,
    LogoIcon
  }
}

export async function getAnalyticsTVLData () {
  const { isMainNet } = getNetworkInfo(getNetworkId())

  const promises = []
  console.log(isMainNet, ' --- main net ')
  if (isMainNet) {
    // promises.push(getTVLStats(getNetworkId()))
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
    setLoading(true)

    ;(async function () {
      try {
        const _data = await getAnalyticsTVLData()
        console.log(_data, ' -- data inside hook')
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
