import React, {
  useEffect,
  useMemo,
  useState
} from 'react'

import { GCR_POOLS_URL } from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import {
  useLiquidityGaugePoolPricing
} from '@/src/hooks/useLiquidityGaugePoolPricing'
import {
  convertToUnits,
  sumOf,
  toBN
} from '@/utils/bn'
import { getReplacedString } from '@/utils/string'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

const initialValue = {
  pools: [],
  tvl: '0'
}

const LiquidityGaugePoolsContext = React.createContext(initialValue)

export function useLiquidityGaugePools () {
  const context = React.useContext(LiquidityGaugePoolsContext)
  if (context === undefined) {
    throw new Error(
      'useLiquidityGaugePools must be used within a LiquidityGaugePoolsProvider'
    )
  }

  return context
}

export const LiquidityGaugePoolsProvider = ({ children }) => {
  const { networkId } = useNetwork()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { notifyError } = useErrorNotifier()
  const { NPMTokenDecimals, liquidityTokenDecimals } = useAppConstants()

  // @TODO: Placeholder for lockedByEveryone from RPC
  const lockedByEveryone = '0'

  const { i18n } = useLingui()

  useEffect(() => {
    async function fetchPools () {
      if (!networkId) {
        return
      }

      const handleError = (err) => {
        notifyError(err, t(i18n)`Could not get liquidity gauge pools`)
      }

      try {
        // Get data from API if wallet's not connected
        const response = await fetch(
          getReplacedString(GCR_POOLS_URL, { networkId }),
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            }
          }
        )

        if (!response.ok) {
          return
        }

        const pools = (await response.json()).data

        if (!pools || Object.keys(pools).length === 0) {
          return
        }

        setData(pools)
      } catch (err) {
        handleError(err)
      }
    }

    setLoading(true)
    fetchPools()
      .then(() => { return setLoading(false) })
      .catch(() => { return setLoading(false) })
  }, [notifyError, networkId, NPMTokenDecimals, i18n])

  const tokenData = useMemo(() => {
    return data.map(pool => {
      return [{
        type: 'pod',
        address: pool.token
      },
      {
        type: 'token',
        address: pool.rewardToken
      }]
    }).flat()
  }, [data])

  const { getPriceByToken } = useLiquidityGaugePoolPricing(tokenData)

  const liquidityGaugePools = useMemo(() => {
    return data.map(pool => {
      const stakingTokenPrice = getPriceByToken(pool.token).toString() === '0'
        ? toBN(10).pow(liquidityTokenDecimals - parseInt(pool.tokenDecimals)).toString()
        : getPriceByToken(pool.token).toString()

      const tvl = toBN(stakingTokenPrice)
        .multipliedBy(pool.balance || lockedByEveryone)
        .toString()

      return {
        ...pool,
        stakingToken: pool.token || '',
        stakingTokenSymbol: pool.tokenSymbol || '',
        stakingTokenDecimals: pool.tokenDecimals || '',
        stakingTokenBalance: pool.balance || '',
        currentDistribution: convertToUnits(pool.currentDistribution || 0, NPMTokenDecimals).toString(),
        tvl
      }
    })
  }, [NPMTokenDecimals, data, getPriceByToken, liquidityTokenDecimals])

  const tvl = sumOf(...liquidityGaugePools.map(pool => { return pool.tvl })).toString()

  return (
    <LiquidityGaugePoolsContext.Provider value={{ loading, pools: liquidityGaugePools, tvl }}>
      {children}
    </LiquidityGaugePoolsContext.Provider>
  )
}
