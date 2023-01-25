import { useState, useEffect } from 'react'
import { getNetworkId } from '@/src/config/environment'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'
import { getHeroStats } from '@/src/services/aggregated-stats/hero-stats'

const defaultData = {
  availableCovers: 0,
  dedicatedCoverCount: 0,
  productCount: 0,
  reportingCovers: 0,
  totalCoverage: '0',
  tvlPool: '0',
  covered: '0',
  coverFee: '0'
}

export const useFetchHeroStats = () => {
  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(false)
  const fetchStats = useSubgraphFetch('useFetchHeroStats')

  useEffect(() => {
    setLoading(true)

    ;(async function () {
      try {
        const _data = await getHeroStats(getNetworkId())

        console.log(Array.from(new Set(_data.reportingKeys)))

        setData({
          ..._data,
          availableCovers: Array.from(new Set(_data.availableKeys)).length,
          reportingCovers: Array.from(new Set(_data.reportingKeys)).length
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    })()
  }, [fetchStats])

  return {
    data,
    loading
  }
}
