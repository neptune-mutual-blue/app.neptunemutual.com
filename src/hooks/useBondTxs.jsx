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
    bondTransactions(
      skip: ${skip}
      first: ${limit}, 
      orderBy: 
      createdAtTimestamp, 
      orderDirection: desc, 
      where: {
        account: "${account}"
      }
    ) {
      type
      account
      npmToVestAmount
      claimAmount
      lpTokenAmount
      bondPool {
        token1
        token1Symbol
        token1Decimals
        lpTokenSymbol
        lpTokenDecimals
      }
      transaction {
        id
        timestamp
      }
    }
  }
  `
}

export const useBondTxs = ({ limit, page }) => {
  const [data, setData] = useState({
    blockNumber: null,
    bondTransactions: []
  })
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const { networkId } = useNetwork()
  const { account } = useWeb3React()
  const fetchBondTxs = useSubgraphFetch('useBondTxs')

  useEffect(() => {
    if (!account) {
      return
    }
    const query = getQuery(account, limit, limit * (page - 1))

    setLoading(true)

    fetchBondTxs(networkId, query)
      .then((_data) => {
        if (!_data) { return }

        const isLastPage =
          _data.bondTransactions.length === 0 ||
          _data.bondTransactions.length < limit

        if (isLastPage) {
          setHasMore(false)
        }

        setData((prev) => {
          return {
            blockNumber: _data._meta.block.number,
            bondTransactions: [
              ...prev.bondTransactions,
              ..._data.bondTransactions
            ]
          }
        })
      })
      .catch((err) => { return console.error(err) })
      .finally(() => {
        setLoading(false)
      })
  }, [account, fetchBondTxs, limit, networkId, page])

  return {
    hasMore,
    data: {
      blockNumber: data.blockNumber,
      transactions: data.bondTransactions,
      totalCount: data.bondTransactions.length
    },
    loading
  }
}
