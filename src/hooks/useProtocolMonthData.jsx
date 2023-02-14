import { useNetwork } from '@/src/context/Network'
import { getGroupedProtocolMonthData } from '@/src/services/aggregated-stats/protocol'
import { useState, useEffect } from 'react'

export const useProtocolMonthData = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const { networkId } = useNetwork()

  useEffect(() => {
    setLoading(true)

    getGroupedProtocolMonthData(networkId)
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
    data,
    loading
  }
}
