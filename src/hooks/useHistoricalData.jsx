import { getHistoricalDataURL } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { useState, useRef } from 'react'

const useHistoricalData = () => {
  const fetched = useRef(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const { networkId } = useNetwork()

  const fetchHistoricalData = async () => {
    if (fetched.current) return

    setLoading(true)

    try {
      const response = await fetch(
        getHistoricalDataURL(networkId),
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
    fetchHistoricalData,
    loading,
    data
  }
}

export { useHistoricalData }
