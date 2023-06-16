import { useNetwork } from '@/src/context/Network'
import { getGroupedProtocolDayData } from '@/src/services/aggregated-stats/protocol'
import { useState, useRef, useEffect, useCallback } from 'react'

export const useProtocolDayData = (eager = true) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const { networkId } = useNetwork()

  const fetched = useRef(false)

  const fetchData = useCallback(() => {
    if (fetched.current || loading) { return }

    setLoading(true)

    getGroupedProtocolDayData(networkId)
      .then((_data) => {
        if (!_data) { return }

        setData(_data)

        fetched.current = true
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [networkId, loading])

  useEffect(() => {
    if (eager) {
      fetchData()
    }
  }, [networkId, eager, fetchData])

  return {
    data: {
      totalCapacity: data?.totalCapacity || [],
      totalCovered: data?.totalCovered || [],
      totalLiquidity: data?.totalLiquidity || []
    },
    loading,
    fetchData
  }
}
