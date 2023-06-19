import {
  useRef,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import {
  getHistoricalAprByCover
} from '@/src/services/api/home/charts/historical-apr-by-cover'

export const useHistoricalRoiDataByCover = () => {
  const fetched = useRef(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const { networkId } = useNetwork()

  const fetchHistoricalDataByCover = async () => {
    if (fetched.current || loading) { return }

    setLoading(true)

    try {
      const _data = await getHistoricalAprByCover(networkId)

      if (!_data) {
        return
      }

      setData(_data)
      fetched.current = true
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
