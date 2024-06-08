import {
  useEffect,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import {
  getLiquidityTransactions
} from '@/src/services/api/liquidity/transactions'
import { useWeb3React } from '@web3-react/core'

export const useLiquidityTxs = ({ limit, page }) => {
  const [data, setData] = useState({
    liquidityTransactions: [],
    blockNumber: null
  })
  const [loading, setLoading] = useState(false)
  // const [hasMore, setHasMore] = useState(true)
  const { networkId } = useNetwork()
  const { account } = useWeb3React()

  useEffect(() => {
    if (!account) {
      return
    }

    setLoading(true)

    getLiquidityTransactions(networkId, account)
      .then((_data) => {
        if (!_data) { return }

        setData({
          blockNumber: null,
          liquidityTransactions: _data
        })

        // const isLastPage =
        //   _data.liquidityTransactions.length === 0 ||
        //   _data.liquidityTransactions.length < limit

        // if (isLastPage) {
        //   setHasMore(false)
        // }

        // setData((prev) => {
        //   return {
        //     blockNumber: _data._meta.block.number,
        //     liquidityTransactions: [
        //       ...prev.liquidityTransactions,
        //       ..._data.liquidityTransactions
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
      transactions: data.liquidityTransactions,
      totalCount: data.liquidityTransactions.length
    },
    loading
    // hasMore
  }
}
