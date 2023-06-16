import { getGasSummaryDataURL } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { useRef, useState } from 'react'

export const useGasSummaryData = () => {
  const fetched = useRef(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const { networkId } = useNetwork()

  const fetchGasSummary = async () => {
    if (fetched.current || loading) { return }

    setLoading(true)

    try {
      const response = await fetch(
        getGasSummaryDataURL(networkId),
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
    fetchGasSummary,
    loading,
    data
  }
}
