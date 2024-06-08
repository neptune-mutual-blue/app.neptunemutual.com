import { useState, useEffect } from 'react'
import { getActiveLiquidities } from '@/src/services/api/liquidity/active'
import { useNetwork } from '@/src/context/Network'

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
  const { networkId } = useNetwork()

  useEffect(() => {
    if (account) {
      setLoading(true)
      getActiveLiquidities(networkId, account)
        .then((userLiquidities) => {
          if (!userLiquidities) { return }

          const myLiquidities = userLiquidities
          setData({
            myLiquidities,
            liquidityList: myLiquidities.map((item) => {
              return {
                podAmount: item.balance || '0',
                podAddress: item.vaultAddress
              }
            })
          })
        })
        .catch((e) => { return console.error(e) })
        .finally(() => { return setLoading(false) })
    }
  }, [account, networkId])

  return {
    data,
    loading
  }
}
