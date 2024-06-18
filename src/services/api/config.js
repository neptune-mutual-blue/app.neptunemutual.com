// Will end with `/`
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? new URL(process.env.NEXT_PUBLIC_API_URL).toString()
  : '/api/'

// GET: ipfs
export const READ_IPFS_URL = `${API_BASE_URL}ipfs/{ipfsHash}`

// GET: policy
export const USER_ACTIVE_POLICIES = `${API_BASE_URL}policy/active/{networkId}/{account}`

export const USER_EXPIRED_POLICIES = `${API_BASE_URL}policy/expired/{networkId}/{account}`

export const USER_POLICY_TXS = `${API_BASE_URL}policy/transactions/{networkId}/{account}`

export const POLICY_RECEIPT_URL = `${API_BASE_URL}/policy/receipt/{networkId}/{txHash}`

// GET: liquidity
export const USER_ACTIVE_LIQUIDITIES = `${API_BASE_URL}liquidity/active/{networkId}/{account}`

export const USER_LIQUIDITY_TXS = `${API_BASE_URL}liquidity/transactions/{networkId}/{account}`

// GET: home
export const PRODUCT_SUMMARY_URL = `${API_BASE_URL}home/product-summary/{networkId}`

export const PRODUCT_SUMMARY_WITH_ACCOUNT_URL = `${API_BASE_URL}home/product-summary/{networkId}/{account}`

// GET: liquidity gauge pools
export const LGP_TXS_URL = `${API_BASE_URL}vote-escrow/lgp/transactions/{networkId}/{account}`

// GET: insights
export const TOP_ACCOUNTS_BY_PROTECTION = `${API_BASE_URL}home/charts/top-accounts-by-protection/{networkId}`

export const TOP_ACCOUNTS_BY_LIQUIDITY = `${API_BASE_URL}home/charts/top-accounts-by-liquidity/{networkId}`

export const HISTORICAL_APR = `${API_BASE_URL}home/charts/historical-apr/{networkId}`

export const HISTORICAL_APR_BY_COVER = `${API_BASE_URL}home/charts/historical-apr-by-cover/{networkId}`

export const PROTECTION_BY_MONTH = `${API_BASE_URL}home/charts/protection-by-month/{networkId}`

export const GAS_PRICE_SUMMARY = `${API_BASE_URL}home/charts/gas-price-summary/{networkId}`

export const COVER_SOLD_BY_POOL = `${API_BASE_URL}home/charts/cover-sold-by-pool/{networkId}`

export const COVER_PREMIUM_BY_POOL = `${API_BASE_URL}home/charts/cover-premium-by-pool/{networkId}`

export const COVER_EXPIRING_THIS_MONTH = `${API_BASE_URL}home/charts/cover-expiring-this-month/{networkId}`

export const LIQUIDITY_SUMMARY = `${API_BASE_URL}home/charts/liquidity-summary/{networkId}`

export const TVL_DISTRIBUTION = `${API_BASE_URL}home/charts/tvl-distribution/{networkId}`

export const COVER_EARNINGS = `${API_BASE_URL}home/charts/cover-earnings/{networkId}`

// GET: consensus
export const RECENT_VOTES = `${API_BASE_URL}consensus/report/votes/{networkId}/{coverKey}/{productKey}/{incidentDate}`

export const INCIDENT_DETAIL = `${API_BASE_URL}consensus/report/insight/{networkId}/{coverKey}/{productKey}/{incidentDate}`

export const ACTIVE_INCIDENTS = `${API_BASE_URL}consensus/report/active/{networkId}`

export const RESOLVED_INCIDENTS = `${API_BASE_URL}consensus/report/resolved/{networkId}`

// GET: bridge
export const BRIDGE_ETH_PRICING_URL = `${API_BASE_URL}bridge/pricing/eth`

export const BRIDGE_NPM_PRICING_URL = `${API_BASE_URL}bridge/pricing/npm`

export const BRIDGE_MATIC_PRICING_URL = `${API_BASE_URL}bridge/pricing/matic`

export const BRIDGE_BNB_PRICING_URL = `${API_BASE_URL}bridge/pricing/bnb`

// POST: policy
export const REFERRAL_CODE_VALIDATION_URL = `${API_BASE_URL}protocol/cover/referral-code`

// POST: ipfs
export const IPFS_REPORT_INFO_URL = `${API_BASE_URL}ipfs/report-info`

export const IPFS_DISPUTE_INFO_URL = `${API_BASE_URL}ipfs/dispute-info`
