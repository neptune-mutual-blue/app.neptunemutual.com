import {
  useEffect,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import {
  getTopAccountsByProtection
} from '@/src/services/api/home/charts/top-accounts-by-protection'

export const useTopAccountsByProtection = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const { networkId } = useNetwork()

  useEffect(() => {
    setLoading(true);

    (async () => {
      try {
        const data = await getTopAccountsByProtection(networkId)

        if (!data) return

        setData(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    })()
  }, [networkId])

  return {
    data,
    loading
  }
}
