import { useNetwork } from '@/src/context/Network'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'
import { useWeb3React } from '@web3-react/core'
import { useState, useEffect } from 'react'

const getQuery = (account, limit, skip) => {
  return `
  {
    _meta {
      block {
        number
      }
    }
    liquidityTransactions(
      skip: ${skip}
      first: ${limit}, 
      orderBy: createdAtTimestamp
      orderDirection: desc
      where: {account: "${account}"}
    ) {
      type
      key
      account
      liquidityAmount
      podAmount
      vault{
        id
        tokenSymbol
        tokenDecimals
      }
      cover {
        id
      }
      transaction {
        id
        timestamp
      }
    }
  }
  `
}

export const useLiquidityTxs = ({ limit, page }) => {
  const [data, setData] = useState({
    blockNumber: null,
    liquidityTransactions: []
  })
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const { networkId } = useNetwork()
  const { account } = useWeb3React()
  const fetchLiquidityTxs = useSubgraphFetch('useLiquidityTxs')

  useEffect(() => {
    if (!account) {
      return
    }
    const query = getQuery(account, limit, limit * (page - 1))

    setLoading(true)

    fetchLiquidityTxs(networkId, query)
      .then((_data) => {
        if (!_data) { return }

        const isLastPage =
          _data.liquidityTransactions.length === 0 ||
          _data.liquidityTransactions.length < limit

        if (isLastPage) {
          setHasMore(false)
        }

        // setData(_data);
        setData((prev) => {
          return {
            blockNumber: _data._meta.block.number,
            liquidityTransactions: [
              ...prev.liquidityTransactions,
              ..._data.liquidityTransactions
            ]
          }
        })
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [account, fetchLiquidityTxs, limit, networkId, page])

  return {
    hasMore,
    data: {
      blockNumber: data.blockNumber,
      transactions: data.liquidityTransactions,
      totalCount: data.liquidityTransactions.length
    },
    loading
  }
}
