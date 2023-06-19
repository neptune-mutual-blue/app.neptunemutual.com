import {
  useCallback,
  useRef,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import {
  getGroupedProtocolMonthData
} from '@/src/services/aggregated-stats/protocol'

export const useProtocolMonthData = (cache = true) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetched = useRef(false)

  const { networkId } = useNetwork()

  const fetchData = useCallback(() => {
    if ((cache && fetched.current)) { return }

    setLoading(true)

    getGroupedProtocolMonthData(networkId)
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
  }, [cache, networkId])

  return {
    data,
    loading,
    fetchData
  }
}
