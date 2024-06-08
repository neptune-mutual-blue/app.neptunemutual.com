import {
  useCallback,
  useRef,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import { getLiquiditySummary } from '@/src/services/api/home/charts/liquidity-summary'

export const useLiquiditySummary = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const fetched = useRef(false)

  const { networkId } = useNetwork()

  const fetchLiquiditySummary = useCallback(async () => {
    if (fetched.current) { return }

    setLoading(true);

    (async () => {
      try {
        const data = await getLiquiditySummary(networkId)

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
    fetchLiquiditySummary,
    data,
    loading
  }
}
