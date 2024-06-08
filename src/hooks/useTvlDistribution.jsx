import {
  useCallback,
  useRef,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import { getTvlDistribution } from '@/src/services/api/home/charts/tvl-distribution'

export const useTvlDistribution = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const fetched = useRef(false)

  const { networkId } = useNetwork()

  const fetchTvlDistribution = useCallback(async () => {
    if (fetched.current) { return }

    setLoading(true);

    (async () => {
      try {
        const data = await getTvlDistribution(networkId)

        if (!data) { return }

        fetched.current = true
        setData(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    })()
  }, [networkId])

  return {
    fetchTvlDistribution,
    data,
    loading
  }
}
