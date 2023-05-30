import { getHistoricalDataByCoverURL } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { useState, useRef } from 'react'

export const useHistoricalRoiDataByCover = () => {
  const fetched = useRef(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const { networkId } = useNetwork()

  const fetchHistoricalDataByCover = async () => {
    if (fetched.current || loading) return

    setLoading(true)

    try {
      const response = await fetch(
        getHistoricalDataByCoverURL(networkId),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      )

      if (!response.ok) {
        return
      }

      fetched.current = true

      const res = await response.json()
      setData(res.data)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  return {
    fetchHistoricalDataByCover,
    loading,
    data
  }
}
