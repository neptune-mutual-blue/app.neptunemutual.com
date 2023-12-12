import { SUBGRAPH_API_URLS } from '@/src/config/constants'
import { detectChainId } from '@/utils/dns'
import { config } from '@neptunemutual/sdk'

export const getNetworkId = () => {
  const host = window.location.host
  const chainId = detectChainId(host)

  return parseInt(chainId, 10)
}

export const getGraphURL = (networkId) => { return SUBGRAPH_API_URLS[networkId] || null }

const STORE_NOT_REQUIRED_FEATURES = ['bridge-layerzero']
const DEFAULT_FEATURES = 'policy,liquidity,reporting,claim,bond,staking-pool,pod-staking-pool,vote-escrow,liquidity-gauge-pools,bridge-celer,bridge-layerzero,governance'

export const isFeatureEnabledServer = (feature) => {
  const str = process.env.NEXT_PUBLIC_FEATURES || DEFAULT_FEATURES

  const features = str.split(',').map((x) => { return x.trim() })

  return features.includes(feature)
}

export const isFeatureEnabled = (feature) => {
  let store

  try {
    store = config.store.getStoreAddressFromEnvironment(getNetworkId())
  } catch (err) {
    // swallow
  }

  const str = process.env.NEXT_PUBLIC_FEATURES ||
    DEFAULT_FEATURES

  let features = str.split(',').map((x) => { return x.trim() })

  if (!store) {
    features = features.filter((f) => { return STORE_NOT_REQUIRED_FEATURES.includes(f) })
  }

  return features.includes(feature)
}

export const mainnetChainIds = [1, 10, 56, 137, 42161, 43114]

export const timeouts = {
  waitForTransactionWithTimeout: 30000
}
