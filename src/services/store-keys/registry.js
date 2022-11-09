import { utils } from '@neptunemutual/sdk'

export const stakingPools = (property = 'stakingPools') => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.CONTRACTS,
      utils.keyUtil.PROTOCOL.CNS.STAKING_POOL
    ],
    returns: 'address',
    property
  }
}

export const policy = (property = 'policy') => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.CONTRACTS,
      utils.keyUtil.PROTOCOL.CNS.COVER_POLICY
    ],
    returns: 'address',
    property
  }
}

export const policyAdmin = (property = 'policyAdmin') => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.CONTRACTS,
      utils.keyUtil.PROTOCOL.CNS.COVER_POLICY_ADMIN
    ],
    returns: 'address',
    property
  }
}

export const governance = (property = 'governance') => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.CONTRACTS,
      utils.keyUtil.PROTOCOL.CNS.GOVERNANCE
    ],
    returns: 'address',
    property
  }
}

export const stablecoin = (property = 'stablecoin') => {
  return {
    key: [utils.keyUtil.PROTOCOL.CNS.COVER_STABLECOIN],
    returns: 'address',
    property
  }
}

export const vault = (coverKey, property = 'vault') => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.CONTRACTS,
      utils.keyUtil.PROTOCOL.CNS.COVER_VAULT,
      coverKey
    ],
    returns: 'address',
    property
  }
}

export const priceDiscovery = (property = 'priceDiscovery') => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.CONTRACTS,
      utils.keyUtil.PROTOCOL.CNS.PRICE_DISCOVERY
    ],
    returns: 'address',
    property
  }
}
