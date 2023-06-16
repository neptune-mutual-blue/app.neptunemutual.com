import { useState, useEffect, useCallback } from 'react'
import { useNetwork } from '@/src/context/Network'
import { CARDS_PER_PAGE } from '@/src/config/constants'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'

const getQuery = (itemsToSkip) => {
  return `
  {
    pools(
      skip: ${itemsToSkip}
      first: ${CARDS_PER_PAGE}
      where: {
        closed: false, 
        poolType: TokenStaking
      }
    ) {
      id
      key
      name
      poolType
      stakingToken
      stakingTokenName
      stakingTokenSymbol
      uniStakingTokenDollarPair
      rewardToken
      rewardTokenName
      rewardTokenSymbol
      uniRewardTokenDollarPair
      rewardTokenDeposit
      maxStake
      rewardPerBlock
      lockupPeriodInBlocks
      platformFee
    }
  }
  `
}

export const useTokenStakingPools = () => {
  const [data, setData] = useState({
    pools: []
  })
  const [loading, setLoading] = useState(false)
  const [itemsToSkip, setItemsToSkip] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const { networkId } = useNetwork()
  const fetchTokenStakingPools = useSubgraphFetch('useTokenStakingPools')

  useEffect(() => {
    if (!networkId) {
      setHasMore(false)
    }

    setLoading(true)

    fetchTokenStakingPools(networkId, getQuery(itemsToSkip))
      .then((_data) => {
        if (!_data) { return }

        const isLastPage =
          _data.pools.length === 0 || _data.pools.length < CARDS_PER_PAGE

        if (isLastPage) {
          setHasMore(false)
        }

        setData((prev) => {
          return {
            pools: [...prev.pools, ..._data.pools]
          }
        })
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [fetchTokenStakingPools, itemsToSkip, networkId])

  const handleShowMore = useCallback(() => {
    setItemsToSkip((prev) => { return prev + CARDS_PER_PAGE })
  }, [])

  return {
    handleShowMore,
    hasMore,
    data: {
      pools: data.pools
    },
    loading
  }
}
