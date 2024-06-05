import {
  useEffect,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import { getPolicyTransactions } from '@/src/services/api/policy/transactions'
import { useWeb3React } from '@web3-react/core'

export const usePolicyTxs = ({ limit, page }) => {
  const [data, setData] = useState({
    policyTransactions: [],
    blockNumber: null
  })
  const [loading, setLoading] = useState(true)
  // const [hasMore, setHasMore] = useState(true) // Pagination not supported by the API
  const { networkId } = useNetwork()
  const { account } = useWeb3React()

  useEffect(() => {
    if (!account) {
      return
    }

    setLoading(true)

    getPolicyTransactions(networkId, account)
      .then((_data) => {
        if (!_data) { return }

        setData({
          blockNumber: null,
          policyTransactions: _data
        })

        // const isLastPage =
        //   _data.policyTransactions.length === 0 ||
        //   _data.policyTransactions.length < limit

        // if (isLastPage) {
        //   setHasMore(false)
        // }

        // setData((prev) => {
        //   return {
        //     blockNumber: _data._meta.block.number,
        //     policyTransactions: [
        //       ...prev.policyTransactions,
        //       ..._data.policyTransactions
        //     ]
        //   }
        // })
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [account, limit, networkId, page])

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
