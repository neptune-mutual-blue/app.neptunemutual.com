import { useState, useEffect } from 'react'
import { getNetworkId } from '@/src/config/environment'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'

const getQuery = (account) => {
  return `
{
  userLiquidities(
    where: {
      account: "${account}"
      totalPodsRemaining_gt: "0"
    }
  ) {
    id
    account
    totalPodsRemaining
    cover {
      id
      coverKey
      vaults {
        tokenSymbol
        tokenDecimals
        address
      }
    }
  }
}
`
}

/**
 *
 * @param {string} account
 * @returns
 */
export const useMyLiquidities = (account) => {
  const [data, setData] = useState({
    myLiquidities: [],
    liquidityList: []
  })
  const [loading, setLoading] = useState(false)
  const fetchMyLiquidities = useSubgraphFetch('useMyLiquidities')

  useEffect(() => {
    if (account) {
      setLoading(true)
      fetchMyLiquidities(getNetworkId(), getQuery(account))
        .then(({ userLiquidities }) => {
          const myLiquidities = userLiquidities || []
          setData({
            myLiquidities,
            liquidityList: myLiquidities.map(
              ({ totalPodsRemaining, cover }) => {
                return {
                  podAmount: totalPodsRemaining || '0',
                  podAddress: cover.vaults[0].address
                }
              }
            )
          })
        })
        .catch((e) => { return console.error(e) })
        .finally(() => { return setLoading(false) })
    }
  }, [account, fetchMyLiquidities])

  return {
    data,
    loading
  }
}
