import { useState, useEffect } from 'react'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'
import { useNetwork } from '@/src/context/Network'

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
  const { networkId } = useNetwork()

  useEffect(() => {
    if (account) {
      setLoading(true)
      fetchMyLiquidities(networkId, getQuery(account))
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
  }, [account, fetchMyLiquidities, networkId])

  return {
    data,
    loading
  }
}
