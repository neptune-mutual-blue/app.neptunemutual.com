import {
  useCallback,
  useRef,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import {
  getGasPriceSummary
} from '@/src/services/api/home/charts/gas-price-summary'

export const useGasSummaryData = () => {
  const fetched = useRef(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const { networkId } = useNetwork()

  const fetchGasSummary = useCallback(async () => {
    if (fetched.current) { return }

    setLoading(true)

    try {
      const _data = await getGasPriceSummary(networkId)

      if (!_data) {
        return
      }

      setData(_data)

      fetched.current = true
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }, [networkId])

  return {
    fetchGasSummary,
    loading,
    data
  }
}
