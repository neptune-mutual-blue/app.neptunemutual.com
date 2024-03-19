import {
  useEffect,
  useState
} from 'react'

import { getNetworkStats } from '@/src/services/aggregated-stats/network-stats'
import { useNetwork } from '@/src/context/Network'

const defaultData = {
  individual: [],
  combined: {
    availableCovers: 0,
    reportingCovers: 0,
    totalNonUniqueDedicatedCoverCount: 0,
    totalNonUniqueProductCount: 0,
    totalCoverFee: '0',
    totalCoveredAmount: '0', // covered
    activeCoveredAmount: '0', // commitment
    totalCoverage: '0',
    totalTvlPool: '0',
    totalTvlCover: '0'
  }
}

export const useNetworkStats = () => {
  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(false)
  const { networkId } = useNetwork()

  useEffect(() => {
    setLoading(true);

    (async function () {
      try {
        const _data = await getNetworkStats(networkId)

        setData({
          individual: _data.individual.filter(Boolean).map(x => {
            return {
              ...x,
              availableKeys: undefined,
              reportingKeys: undefined,
              availableCovers: x.availableKeys.length,
              reportingCovers: x.reportingKeys.length
            }
          }),
          combined: {
            ..._data.combined,
            uniqueAvailableKeys: undefined,
            uniqueReportingKeys: undefined,
            availableCovers: _data.combined.uniqueAvailableKeys.length,
            reportingCovers: _data.combined.uniqueReportingKeys.length
          }
        })
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
