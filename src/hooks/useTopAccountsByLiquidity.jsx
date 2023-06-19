import {
  useCallback,
  useRef,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import {
  getTopAccountsByLiquidity
} from '@/src/services/api/home/charts/top-accounts-by-liquidity'

export const useTopAccountsByLiquidity = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const fetched = useRef(false)

  const { networkId } = useNetwork()

  const fetchTopAccounts = useCallback(async () => {
    if (fetched.current) { return }

    setLoading(true);

    (async () => {
      try {
        const data = await getTopAccountsByLiquidity(networkId)

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
    fetchTopAccountsByLiquidity: fetchTopAccounts,
    data,
    loading
  }
}
