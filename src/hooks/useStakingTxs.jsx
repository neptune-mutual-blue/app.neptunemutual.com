import {
  useEffect,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'
import { useWeb3React } from '@web3-react/core'

const getQuery = (account, limit, skip) => {
  return `
  {
    _meta {
      block {
        number
      }
    }
    poolTransactions(
      skip: ${skip}
      first: ${limit}, 
      orderBy: 
      createdAtTimestamp, 
      orderDirection: desc, 
      where:{
        account: "${account}"
      }
    ) {
      id
      poolType
      type
      account
      token
      amount
      rewards
      platformFee
      pool {
        key
        name
        stakingTokenSymbol
        rewardTokenDecimals
        stakingTokenDecimals
        rewardTokenSymbol
      }
      createdAtTimestamp
      transaction{
        id
      }
    }
  }
  `
}

export const useStakingTxs = ({ limit, page }) => {
  const [data, setData] = useState({
    blockNumber: null,
    poolTransactions: []
  })
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const { networkId } = useNetwork()
  const { account } = useWeb3React()
  const fetchStakingTxs = useSubgraphFetch('useStakingTxs')

  useEffect(() => {
    if (!account) {
      return
    }
    const query = getQuery(account, limit, limit * (page - 1))

    setLoading(true)

    fetchStakingTxs(networkId, query)
      .then((_data) => {
        if (!_data) { return }

        const isLastPage =
          _data.poolTransactions.length === 0 ||
          _data.poolTransactions.length < limit

        if (isLastPage) {
          setHasMore(false)
        }

        setData((prev) => {
          return {
            blockNumber: _data._meta.block.number,
            poolTransactions: [
              ...prev.poolTransactions,
              ..._data.poolTransactions
            ]
          }
        })
      })
      .catch((err) => { return console.error(err) })
      .finally(() => {
        setLoading(false)
      })
  }, [account, fetchStakingTxs, limit, networkId, page])

  return {
    hasMore,
    data: {
      blockNumber: data.blockNumber,
      transactions: data.poolTransactions,
      totalCount: data.poolTransactions.length
    },
    loading
  }
}
