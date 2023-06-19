import {
  useCallback,
  useRef,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import { getHistoricalApr } from '@/src/services/api/home/charts/historical-apr'

export const useHistoricalData = () => {
  const fetched = useRef(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const { networkId } = useNetwork()

  const fetchHistoricalData = useCallback(async () => {
    if (fetched.current || loading) { return }

    setLoading(true)

    try {
      const _data = await getHistoricalApr(networkId)

      if (!_data) {
        return
      }

      setData(_data)

      fetched.current = true
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }, [loading, networkId])

  return {
    fetchHistoricalData,
    loading,
    data
  }
}
