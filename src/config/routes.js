import { safeParseBytes32String } from '@/utils/formatter/bytes32String'

const ViewCover = (coverKey) => {
  const coverId = safeParseBytes32String(coverKey)

  return `/covers/${coverId}`
}

const ViewProduct = (coverKey, productKey) => {
  const coverId = safeParseBytes32String(coverKey)
  const productId = safeParseBytes32String(productKey)

  return `/covers/${coverId}/products/${productId}`
}

const ProvideLiquidity = (coverKey) => {
  const coverId = safeParseBytes32String(coverKey)

  return `/covers/${coverId}/add-liquidity`
}

const PurchasePolicy = (coverKey, productKey) => {
  const coverId = safeParseBytes32String(coverKey)
  const productId = safeParseBytes32String(productKey)

  if (productId === '') {
    return `/covers/${coverId}/purchase`
  }

  return `/covers/${coverId}/products/${productId}/purchase`
}

const ReportNewIncident = (coverKey, productKey) => {
  const coverId = safeParseBytes32String(coverKey)
  const productId = safeParseBytes32String(productKey)

  if (productId === '') {
    return `/covers/${coverId}/new-report`
  }

  return `/covers/${coverId}/products/${productId}/new-report`
}

const ClaimPolicy = (coverKey, productKey, incidentDate) => {
  const coverId = safeParseBytes32String(coverKey)
  const productId = safeParseBytes32String(productKey)

  if (productId === '') {
    return `/my-policies/${coverId}/incidents/${incidentDate}/claim`
  }

  return `/my-policies/${coverId}/products/${productId}/incidents/${incidentDate}/claim`
}

const ViewPolicyReceipt = (txHash) => {
  return `/my-policies/receipt/${txHash}`
}

const ViewReport = (coverKey, productKey, incidentDate) => {
  const coverId = safeParseBytes32String(coverKey)
  const productId = safeParseBytes32String(productKey)

  if (productId === '') {
    return `/reports/${coverId}/incidents/${incidentDate}`
  }

  return `/reports/${coverId}/products/${productId}/incidents/${incidentDate}`
}

const DisputeReport = (coverKey, productKey, incidentDate) => {
  const coverId = safeParseBytes32String(coverKey)
  const productId = safeParseBytes32String(productKey)

  if (productId === '') {
    return `/reports/${coverId}/incidents/${incidentDate}/dispute`
  }

  return `/reports/${coverId}/products/${productId}/incidents/${incidentDate}/dispute`
}

const ViewCoverReports = (coverKey) => {
  const coverId = safeParseBytes32String(coverKey)

  return `/reports/${coverId}`
}

const MyCoverLiquidity = (coverKey) => {
  const coverId = safeParseBytes32String(coverKey)

  return `/my-liquidity/${coverId}`
}

const ViewProductReports = (coverKey, productKey) => {
  const coverId = safeParseBytes32String(coverKey)
  const productId = safeParseBytes32String(productKey)

  return `/reports/${coverId}/products/${productId}`
}

const ViewCoverProductTerms = (coverKey, productKey) => {
  const coverId = safeParseBytes32String(coverKey)
  const productId = safeParseBytes32String(productKey)

  if (productId === '') {
    return `/covers/${coverId}/cover-terms`
  }

  return `/covers/${coverId}/products/${productId}/cover-terms`
}

const Home = '/'
const TransactionHistory = '/transactions'
const BondTransactions = '/pools/bond/transactions'
const PolicyTransactions = '/my-policies/transactions'
const LiquidityTransactions = '/my-liquidity/transactions'
const MyPolicies = '/my-policies/active'
const MyExpiredPolicies = '/my-policies/expired'
const MyLiquidity = '/my-liquidity'
const ActiveReports = '/reports/active'
const ResolvedReports = '/reports/resolved'
const BondPool = '/pools/bond'
const StakingPools = '/pools/staking'
const PodStakingPools = '/pools/pod-staking'
const StakingPoolsTransactions = '/pools/staking/transactions'
const PodStakingPoolsTransactions = '/pools/pod-staking/transactions'

export const Routes = {
  Home,
  TransactionHistory,
  BondTransactions,
  PolicyTransactions,
  LiquidityTransactions,
  MyPolicies,
  MyExpiredPolicies,
  MyLiquidity,
  ActiveReports,
  ResolvedReports,
  BondPool,
  StakingPools,
  StakingPoolsTransactions,
  PodStakingPools,
  PodStakingPoolsTransactions,
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
  ViewProductReports
}
