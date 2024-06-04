import {
  useEffect,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'
import { getPolicyTransactions } from '@/src/services/api/policy/transactions'
import { useWeb3React } from '@web3-react/core'

export const usePolicyTxs = ({ limit, page }) => {
  const [data, setData] = useState({
    policyTransactions: [],
    blockNumber: null
  })
  const [loading, setLoading] = useState(true)
  // const [hasMore, setHasMore] = useState(true)
  const { networkId } = useNetwork()
  const { account } = useWeb3React()
  const fetchPolicyTxs = useSubgraphFetch('usePolicyTxs')

  useEffect(() => {
    if (!account) {
      return
    }

    setLoading(true)

    getPolicyTransactions(networkId, account)
      .then((data) => {
        if (!data) { return }

        setData({
          blockNumber: null,
          policyTransactions: data
        })
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [account, fetchPolicyTxs, limit, networkId, page])

  return {
    data: {
      blockNumber: data.blockNumber,
      transactions: data.policyTransactions,
      totalCount: data.policyTransactions.length
    },
    loading
    // hasMore
  }
}
