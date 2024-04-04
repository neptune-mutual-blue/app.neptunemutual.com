import { DEFAULT_NETWORK } from '@/src/config/constants'
import { isFeatureEnabled } from '@/src/config/environment'
import { networkIdToSlug } from '@/src/config/networks'
import { safeParseBytes32String } from '@/utils/formatter/bytes32String'

const NotFound = '/404'
/** @type {(networkId: number) => string} */
const TransactionHistory = (networkId) => { return getRoutePrefix(networkId) + '/transactions' }
/** @type {(networkId: number) => string} */
const BondTransactions = (networkId) => { return getRoutePrefix(networkId) + '/pools/bond/transactions' }
/** @type {(networkId: number) => string} */
const PolicyTransactions = (networkId) => { return getRoutePrefix(networkId) + '/my-policies/transactions' }
/** @type {(networkId: number) => string} */
const LiquidityTransactions = (networkId) => { return getRoutePrefix(networkId) + '/my-liquidity/transactions' }
/** @type {(networkId: number) => string} */
const MyActivePolicies = (networkId) => { return getRoutePrefix(networkId) + '/my-policies/active' }
/** @type {(networkId: number) => string} */
const MyExpiredPolicies = (networkId) => { return getRoutePrefix(networkId) + '/my-policies/expired' }
/** @type {(networkId: number) => string} */
const MyLiquidity = (networkId) => { return getRoutePrefix(networkId) + '/my-liquidity' }
/** @type {(networkId: number) => string} */
const ActiveReports = (networkId) => { return getRoutePrefix(networkId) + '/reports/active' }
/** @type {(networkId: number) => string} */
const Governance = (networkId) => { return getRoutePrefix(networkId) + '/governance' }
/** @type {(networkId: number) => string} */
const VoteEscrow = (networkId) => { return getRoutePrefix(networkId) + '/vote-escrow' }
/** @type {(networkId: number) => string} */
const ResolvedReports = (networkId) => { return getRoutePrefix(networkId) + '/reports/resolved' }
/** @type {(networkId: number) => string} */
const BondPool = (networkId) => { return getRoutePrefix(networkId) + '/pools/bond' }
/** @type {(networkId: number) => string} */
const StakingPools = (networkId) => { return getRoutePrefix(networkId) + '/pools/staking' }
/** @type {(networkId: number) => string} */
const PodStakingPools = (networkId) => { return getRoutePrefix(networkId) + '/pools/pod-staking' }
/** @type {(networkId: number) => string} */
const BondPoolTransactions = (networkId) => { return getRoutePrefix(networkId) + '/pools/bond/transactions' }
/** @type {(networkId: number) => string} */
const StakingPoolsTransactions = (networkId) => { return getRoutePrefix(networkId) + '/pools/staking/transactions' }
/** @type {(networkId: number) => string} */
const PodStakingPoolsTransactions = (networkId) => { return getRoutePrefix(networkId) + '/pools/pod-staking/transactions' }
/** @type {(networkId: number) => string} */
const LiquidityGaugePoolsTransactions = (networkId) => { return getRoutePrefix(networkId) + '/pools/liquidity-gauge-pools/transactions' }
/** @type {(networkId: number) => string} */
const LiquidityGaugePools = (networkId) => { return getRoutePrefix(networkId) + '/pools/liquidity-gauge-pools' }
/** @type {(networkId: number) => string} */
const Bridge = (networkId) => { return getRoutePrefix(networkId) + '/bridge' }

/** @type {(proposalId:string, networkId: number) => string} */
const GovernanceProposalPage = (proposalId, networkId) => { return getRoutePrefix(networkId) + `/governance/${proposalId}` }

/** @type {(networkId: number) => string} */
const getRoutePrefix = (networkId) => {
  return `/${networkIdToSlug[networkId]}`
}

/** @type {(networkId: any) => string} */
const Home = (networkId) => {
  return (Number(networkId) === DEFAULT_NETWORK) ? '/' : getRoutePrefix(networkId) + '/'
}

/** @type {(networkId: number) => string} */
const Pools = (networkId) => {
  let url = null
  // ORDER is important
  if (isFeatureEnabled('liquidity-gauge-pools', networkId)) {
    url = LiquidityGaugePools(networkId)
  } else if (isFeatureEnabled('bond', networkId)) {
    url = BondPool(networkId)
  } else if (isFeatureEnabled('staking-pool', networkId)) {
    url = StakingPools(networkId)
  } else if (isFeatureEnabled('pod-staking-pool', networkId)) {
    url = PodStakingPools(networkId)
  }

  return url
}

/** @type {(coverKey: any, networkId: number) => string} */
const ViewCover = (coverKey, networkId) => {
  const coverId = safeParseBytes32String(coverKey)

  return getRoutePrefix(networkId) + `/covers/${coverId}`
}

/** @type {(coverKey: any, productKey: any, networkId: number) => string} */
const ViewProduct = (coverKey, productKey, networkId) => {
  const coverId = safeParseBytes32String(coverKey)
  const productId = safeParseBytes32String(productKey)

  return getRoutePrefix(networkId) + `/covers/${coverId}/products/${productId}`
}

/** @type {(coverKey: any, networkId: number) => string} */
const ProvideLiquidity = (coverKey, networkId) => {
  const coverId = safeParseBytes32String(coverKey)

  return getRoutePrefix(networkId) + `/covers/${coverId}/add-liquidity`
}

/** @type {(coverKey: any, productKey: any, networkId: number) => string} */
const PurchasePolicy = (coverKey, productKey, networkId) => {
  const coverId = safeParseBytes32String(coverKey)
  const productId = safeParseBytes32String(productKey)

  if (productId === '') {
    return getRoutePrefix(networkId) + `/covers/${coverId}/purchase`
  }

  return getRoutePrefix(networkId) + `/covers/${coverId}/products/${productId}/purchase`
}

/** @type {(coverKey: any, productKey: any, networkId: number) => string} */
const ReportNewIncident = (coverKey, productKey, networkId) => {
  const coverId = safeParseBytes32String(coverKey)
  const productId = safeParseBytes32String(productKey)

  if (productId === '') {
    return getRoutePrefix(networkId) + `/covers/${coverId}/new-report`
  }

  return getRoutePrefix(networkId) + `/covers/${coverId}/products/${productId}/new-report`
}

/** @type {(coverKey: any, productKey: any, incidentDate:any, networkId: number) => string} */
const ClaimPolicy = (coverKey, productKey, incidentDate, networkId) => {
  const coverId = safeParseBytes32String(coverKey)
  const productId = safeParseBytes32String(productKey)

  if (productId === '') {
    return getRoutePrefix(networkId) + `/my-policies/${coverId}/incidents/${incidentDate}/claim`
  }

  return getRoutePrefix(networkId) + `/my-policies/${coverId}/products/${productId}/incidents/${incidentDate}/claim`
}

/** @type {(txHash: any, networkId: number) => string} */
const ViewPolicyReceipt = (txHash, networkId) => {
  return getRoutePrefix(networkId) + `/my-policies/receipt/${txHash}`
}

/** @type {(coverKey: any, productKey: any, incidentDate:any, networkId: number) => string} */
const ViewReport = (coverKey, productKey, incidentDate, networkId) => {
  const coverId = safeParseBytes32String(coverKey)
  const productId = safeParseBytes32String(productKey)

  if (productId === '') {
    return getRoutePrefix(networkId) + `/reports/${coverId}/incidents/${incidentDate}/details`
  }

  return getRoutePrefix(networkId) + `/reports/${coverId}/products/${productId}/incidents/${incidentDate}/details`
}

/** @type {(coverKey: any, productKey: any, incidentDate:any, networkId: number) => string} */
const DisputeReport = (coverKey, productKey, incidentDate, networkId) => {
  const coverId = safeParseBytes32String(coverKey)
  const productId = safeParseBytes32String(productKey)

  if (productId === '') {
    return getRoutePrefix(networkId) + `/reports/${coverId}/incidents/${incidentDate}/dispute`
  }

  return getRoutePrefix(networkId) + `/reports/${coverId}/products/${productId}/incidents/${incidentDate}/dispute`
}

/** @type {(coverKey: any, networkId: number) => string} */
const ViewCoverReports = (coverKey, networkId) => {
  const coverId = safeParseBytes32String(coverKey)

  return getRoutePrefix(networkId) + `/reports/${coverId}`
}

/** @type {(coverKey: any, networkId: number) => string} */
const MyCoverLiquidity = (coverKey, networkId) => {
  const coverId = safeParseBytes32String(coverKey)

  return getRoutePrefix(networkId) + `/my-liquidity/${coverId}`
}

/** @type {(coverKey: any, productKey: any, networkId: number) => string} */
const ViewProductReports = (coverKey, productKey, networkId) => {
  const coverId = safeParseBytes32String(coverKey)
  const productId = safeParseBytes32String(productKey)

  return getRoutePrefix(networkId) + `/reports/${coverId}/products/${productId}`
}

/** @type {(coverKey: any, productKey: any, networkId: number) => string} */
const ViewCoverProductTerms = (coverKey, productKey, networkId) => {
  const coverId = safeParseBytes32String(coverKey)
  const productId = safeParseBytes32String(productKey)

  if (productId === '') {
    return getRoutePrefix(networkId) + `/covers/${coverId}/cover-terms`
  }

  return getRoutePrefix(networkId) + `/covers/${coverId}/products/${productId}/cover-terms`
}

export const Routes = {
  getRoutePrefix,
  Home,
  NotFound,
  TransactionHistory,
  BondTransactions,
  PolicyTransactions,
  LiquidityTransactions,
  MyActivePolicies,
  MyExpiredPolicies,
  MyLiquidity,
  ActiveReports,
  ResolvedReports,
  BondPool,
  BondPoolTransactions,
  StakingPools,
  StakingPoolsTransactions,
  PodStakingPools,
  PodStakingPoolsTransactions,
  LiquidityGaugePoolsTransactions,
  LiquidityGaugePools,
  Pools,
  ViewCover,
  ViewProduct,
  ViewReport,
  ViewPolicyReceipt,
  DisputeReport,
  PurchasePolicy,
  ProvideLiquidity,
  MyCoverLiquidity,
  ReportNewIncident,
  ClaimPolicy,
  ViewCoverReports,
  ViewCoverProductTerms,
  ViewProductReports,
  VoteEscrow,
  Bridge,
  Governance,
  GovernanceProposalPage
}
