import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { GCR_POOLS_URL } from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { useNetwork } from '@/src/context/Network'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { convertToUnits } from '@/utils/bn'
import { getReplacedString } from '@/utils/string'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

/**
 * @typedef {Object} LiquidityGaugePool
 * @property {string | undefined} id - The ID of the pool.
 * @property {string} chainId - The ID of the blockchain network.
 * @property {string} key - The unique key of the pool.
 * @property {string} epochDuration - The duration of the epoch.
 * @property {string} poolAddress - The address of the pool.
 * @property {string} name - The name of the pool.
 * @property {string} info - The IPFS hash of the pool's info.
 * @property {{description: string}} infoDetails - Detailed information about the pool.
 * @property {string} platformFee - The platform fee for the pool.
 * @property {string} rewardToken - The address of the reward token.
 * @property {string} token - The address of the token.
 * @property {string} balance - The balance of the token.
 * @property {string} lockupPeriodInBlocks - The lockup period in blocks.
 * @property {string} ratio - The ratio of the pool.
 * @property {boolean} active - Whether the pool is active or not.
 * @property {string} currentEpoch - The current epoch of the pool.
 * @property {string} currentDistribution - The current distribution of the pool.
 * @property {string} tokenSymbol - The symbol of the token.
 * @property {string} tokenDecimals - The number of decimals of the token.
 *
 * @property {string} stakingToken - The address of the staking token.
 * @property {string} stakingTokenSymbol - The symbol of the staking token.
 * @property {string} stakingTokenDecimals - The number of decimals of the staking token.
 * @property {string} stakingTokenBalance - The balance of the staking token.
 */

/**
 * @typedef {Object} PoolData
 * @property {LiquidityGaugePool[]} data - An array of Liquidity pool data.
 * @property {boolean} loading - Whether the data is loading or not.
 */

/** @type {PoolData} */
const initialData = {
  data: [],
  loading: false
}

const LiquidityGaugePoolsContext = createContext(initialData)

export const useLiquidityGaugePools = ({ NPMTokenDecimals }) => {
  const context = useContext(LiquidityGaugePoolsContext)
  if (context === undefined) {
    throw new Error(
      'useLiquidityGaugePools must be used within a LiquidityGaugePoolsProvider'
    )
  }

  const sanitizedData = useMemo(() => {
    /** @type {LiquidityGaugePool[]} */
    const sanitizedData = context.data.map(pool => {
      return {
        ...pool,
        stakingToken: pool.token || '',
        stakingTokenSymbol: pool.tokenSymbol || '',
        stakingTokenDecimals: pool.tokenDecimals || '',
        stakingTokenBalance: pool.balance || '',
        currentDistribution: convertToUnits(pool.currentDistribution || 0, NPMTokenDecimals).toString()
      }
    })

    return sanitizedData
  }, [context.data, NPMTokenDecimals])

  return {
    data: sanitizedData,
    loading: context.loading
  }
}

export const LiquidityGaugePoolsProvider = ({ children }) => {
  const { networkId } = useNetwork()

  const [data, setData] = useState(/** @type {LiquidityGaugePool[]} */([]))
  const [loading, setLoading] = useState(false)
  const { notifyError } = useErrorNotifier()

  const { i18n } = useLingui()

  const { pathname } = useRouter()

  const isPoolsPage = useMemo(() => {
    return [
      Routes.BondPool,
      Routes.StakingPools,
      Routes.PodStakingPools,
      Routes.LiquidityGaugePools,
      Routes.LiquidityGaugePoolsTransactions
    ].includes(pathname)
  }, [pathname])

  useEffect(() => {
    async function fetchPools () {
      if (!networkId || !isPoolsPage) {
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
  }, [notifyError, networkId, i18n, isPoolsPage])

  return (
    <LiquidityGaugePoolsContext.Provider value={{ data, loading }}>
      {children}
    </LiquidityGaugePoolsContext.Provider>
  )
}
