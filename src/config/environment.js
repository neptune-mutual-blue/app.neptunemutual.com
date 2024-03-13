import { SUBGRAPH_API_URLS } from '@/src/config/constants'
import { enabledFeatures } from '@/src/config/networks'
import { detectChainId } from '@/utils/dns'
import { config } from '@neptunemutual/sdk'

export const getNetworkId = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const host = window.location.host
  const chainId = detectChainId(host)

  return parseInt(chainId, 10)
}

export const getGraphURL = (networkId) => { return SUBGRAPH_API_URLS[networkId] || null }

const isStoreAvailable = (networkId) => {
  if (typeof window === 'undefined') {
    throw new Error('window is not defined')
  }

  try {
    const store = config.store.getStoreAddressFromEnvironment(networkId)

    if (store) {
      return true
    }
  } catch (err) { /* swallow */ }

  return false
}

export const isFeatureEnabled = (feature, networkId) => {
  if (typeof window !== 'undefined') {
    // If the feature requires `store`, then check if the store is available
    if (!['bridge-celer', 'bridge-layerzero'].includes(feature) && !isStoreAvailable(networkId)) {
      return false
    }
  }

  /**
   * '' - all features are enabled - lowest priority
   * NEXT_PUBLIC_FEATURES - use for all networks - policy,liquidity,reporting,claim,bridge-celer,bridge-layerzero
   * NEXT_PUBLIC_POLYGON_FEATURES - bridge-layerzero - highest priority
   */

  let str = process.env.NEXT_PUBLIC_FEATURES || ''

  if (enabledFeatures[networkId]) {
    str = enabledFeatures[networkId]
  }

  str =
    str ||
    'policy,liquidity,reporting,claim,bond,staking-pool,pod-staking-pool,vote-escrow,liquidity-gauge-pools,bridge-celer,bridge-layerzero,governance'
  const features = str.split(',').map((x) => { return x.trim() })

  return features.indexOf(feature) > -1
}

export const mainnetChainIds = [1, 10, 56, 137, 42161, 43114]

export const timeouts = {
  waitForTransactionWithTimeout: 30000
}
