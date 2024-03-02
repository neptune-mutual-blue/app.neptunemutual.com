import {
  useEffect,
  useState
} from 'react'

import { getHeroStats } from '@/src/services/aggregated-stats/hero-stats'
import { useNetwork } from '@/src/context/Network'

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
  const { networkId } = useNetwork()

  useEffect(() => {
    setLoading(true)

    ;(async function () {
      try {
        const _data = await getHeroStats(networkId)

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
  }, [networkId])

  return {
    data,
    loading
  }
}
