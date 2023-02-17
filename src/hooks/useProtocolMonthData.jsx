import { useNetwork } from '@/src/context/Network'
import { getGroupedProtocolMonthData } from '@/src/services/aggregated-stats/protocol'
import { useState, useRef } from 'react'

export const useProtocolMonthData = (cache = true) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetched = useRef(false)

  const { networkId } = useNetwork()

  const fetchData = () => {
    if (cache && fetched.current) return

    setLoading(true)

    getGroupedProtocolMonthData(networkId)
      .then((_data) => {
        if (!_data) return

        setData(_data)

        fetched.current = true
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return {
    data,
    loading,
    fetchData
  }
}
