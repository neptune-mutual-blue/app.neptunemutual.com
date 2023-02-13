import { useNetwork } from '@/src/context/Network'
import { getGroupedProtocolDayData } from '@/src/services/aggregated-stats/protocol'
import { useState, useEffect } from 'react'

export const useProtocolDayData = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const { networkId } = useNetwork()

  useEffect(() => {
    setLoading(true)

    getGroupedProtocolDayData(networkId)
      .then((_data) => {
        if (!_data) return

        setData(_data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [networkId])

  return {
    data: {
      totalCapacity: data?.totalCapacity || [],
      totalCovered: data?.totalCovered || [],
      totalLiquidity: data?.totalLiquidity || []
    },
    loading
  }
}
