import { useNetwork } from '@/src/context/Network'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'
import { useWeb3React } from '@web3-react/core'
import { useState, useEffect } from 'react'

const getQuery = (limit, page, account) => {
  return `
  {
    _meta {
      block {
        number
      }
    }
    policyTransactions(
      skip: ${limit * (page - 1)}
      first: ${limit} 
      orderBy: createdAtTimestamp
      orderDirection: desc
      where: {onBehalfOf: "${account}"}
    ) {
      type
      coverKey
      productKey
      onBehalfOf
      cxTokenAmount
      stablecoinAmount
      cxToken {
        id
        tokenSymbol
        tokenDecimals
        tokenName
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

export const usePolicyTxs = ({ limit, page }) => {
  const [data, setData] = useState({
    policyTransactions: [],
    blockNumber: null
  })
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const { networkId } = useNetwork()
  const { account } = useWeb3React()
  const fetchPolicyTxs = useSubgraphFetch('usePolicyTxs')

  useEffect(() => {
    if (!account) {
      return
    }

    setLoading(true)

    fetchPolicyTxs(networkId, getQuery(limit, page, account))
      .then((_data) => {
        if (!_data) { return }

        const isLastPage =
          _data.policyTransactions.length === 0 ||
          _data.policyTransactions.length < limit

        if (isLastPage) {
          setHasMore(false)
        }

        setData((prev) => {
          return {
            blockNumber: _data._meta.block.number,
            policyTransactions: [
              ...prev.policyTransactions,
              ..._data.policyTransactions
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
  }, [account, fetchPolicyTxs, limit, networkId, page])

  return {
    data: {
      blockNumber: data.blockNumber,
      transactions: data.policyTransactions,
      totalCount: data.policyTransactions.length
    },
    loading,
    hasMore
  }
}
