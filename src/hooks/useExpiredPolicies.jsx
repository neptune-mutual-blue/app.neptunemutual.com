import {
  useEffect,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import { getExpiredPolicies } from '@/src/services/api/policy/expired'
import { useWeb3React } from '@web3-react/core'

export const useExpiredPolicies = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const { networkId } = useNetwork()
  const { account } = useWeb3React()

  useEffect(() => {
    if (!account) {
      return
    }

    setLoading(true);

    (async () => {
      try {
        const data = await getExpiredPolicies(networkId, account)

        if (!data) { return }

        setData(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    })()
  }, [account, networkId])

  return {
    data,
    loading
  }
}
