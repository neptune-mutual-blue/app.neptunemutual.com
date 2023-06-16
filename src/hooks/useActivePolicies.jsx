import {
  useEffect,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import { getActivePolicies } from '@/src/services/api/policy/active'
import { sumOf } from '@/utils/bn'
import { useWeb3React } from '@web3-react/core'

export const useActivePolicies = () => {
  const [data, setData] = useState({
    activePolicies: [],
    totalActiveProtection: '0'
  })
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
        const data = await getActivePolicies(networkId, account)

        if (!data) { return }

        setData({
          activePolicies: data,
          totalActiveProtection: sumOf(...data.map(policy => { return policy.amount })).toString()
        })
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
