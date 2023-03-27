export const MULTIPLIER = 10_000
export const DAYS = 86400

export const DEFAULT_GAS_LIMIT = '6000000'
export const ADDRESS_ONE = process.env.NEXT_PUBLIC_FALLBACK_ACCOUNT || '0x0000000000000000000000000000000000000001'
export const ROWS_PER_PAGE = 50
export const CARDS_PER_PAGE = 100
export const GAS_MARGIN_MULTIPLIER = 1.5

export const DEBOUNCE_TIMEOUT = 400

export const CoverStatus = {
  0: 'Normal',
  1: 'Stopped',
  2: 'Incident Happened',
  3: 'False Reporting',
  4: 'Claimable'
}

export const ReportStatus = {
  Reporting: 'Incident Happened',
  Claimable: 'Claimable',
  FalseReporting: 'False Reporting'
}

export const PoolTypes = {
  TOKEN: 'token',
  POD: 'pod'
}

export const GITHUB_REPONAME = 'app.neptunemutual.com'
export const GITHUB_USERNAME = 'neptune-mutual-blue'
export const DISCORD_LINK = 'https://discord.gg/2qMGTtJtnW'
export const STANDARD_TERMS_AND_CONDITIONS = 'https://docs.neptunemutual.com/usage/standard-terms-and-conditions'

// Will end with `/`
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? new URL(process.env.NEXT_PUBLIC_API_URL).toString()
  : '/'

export const IPFS_HASH_URL = 'https://ipfs.io/ipfs/{ipfsHash}'
export const PRODUCT_SUMMARY_URL = `${API_BASE_URL}home/product-summary/{networkId}`
export const PRODUCT_SUMMARY_WITH_ACCOUNT_URL = `${API_BASE_URL}home/product-summary/{networkId}/{account}`
export const getHistoricalDataURL = (chainId) => `${API_BASE_URL}home/charts/historical-apr/${chainId}`
export const getGasSummaryDataURL = (chainId) => `${API_BASE_URL}home/charts/gas-price-summary/${chainId}`
export const getHistoricalDataByCoverURL = (chainId) => `${API_BASE_URL}home/charts/historical-apr-by-cover/${chainId}`
export const getMonthlyProtectionDataURL = (chainId) => `${API_BASE_URL}home/charts/protection-by-month/${chainId}`
export const getCoverSoldByPoolURL = (chainId) => `${API_BASE_URL}/home/charts/cover-sold-by-pool/${chainId}`
export const getCoverPremiumByPoolURL = (chainId) => `${API_BASE_URL}/home/charts/cover-premium-by-pool/${chainId}`
export const getExpiringCoversURL = (chainId) => `${API_BASE_URL}/home/charts/cover-expiring-this-month/${chainId}`
export const PRICING_URL = `${API_BASE_URL}pricing/{networkId}`
export const POOL_INFO_URL = `${API_BASE_URL}protocol/staking-pools/info/{type}/{networkId}/{key}/{account}`
export const UNSTAKE_INFO_URL = `${API_BASE_URL}protocol/consensus/unstake-info/{networkId}/{coverKey}/{productKey}/{account}/{incidentDate}`
export const BOND_INFO_URL = `${API_BASE_URL}protocol/bond/info/{networkId}/{account}`
export const GET_CONTRACTS_INFO_URL = `${API_BASE_URL}protocol/contracts/{networkName}`
export const COVER_STATS_URL = `${API_BASE_URL}protocol/cover/stats/{networkId}/{coverKey}/{productKey}/{account}`
export const VAULT_INFO_URL = `${API_BASE_URL}protocol/vault/info/{networkId}/{coverKey}/{account}`
export const REFERRAL_CODE_VALIDATION_URL = `${API_BASE_URL}protocol/cover/referral-code`

export const POOL_URLS = {
  1: 'https://app.sushi.com/add/{liquidityTokenAddress}/{NPMTokenAddress}',
  80001: 'https://legacy.quickswap.exchange/#/add/{liquidityTokenAddress}/{NPMTokenAddress}',
  42161: 'https://app.uniswap.org/#/add/{liquidityTokenAddress}/{NPMTokenAddress}',
  43113: 'https://legacy.pangolin.exchange/#/add/{liquidityTokenAddress}/{NPMTokenAddress}'
}

export const SUBGRAPH_API_URLS = {
  1: process.env.NEXT_PUBLIC_ETHEREUM_SUBGRAPH_URL,
  // 80001: process.env.NEXT_PUBLIC_MUMBAI_SUBGRAPH_URL,
  42161: process.env.NEXT_PUBLIC_ARBITRUM_SUBGRAPH_URL,
  43113: process.env.NEXT_PUBLIC_FUJI_SUBGRAPH_URL
}

export const TEST_URL = process.env.NEXT_PUBLIC_TEST_URL || 'https://test.neptunemutual.net'
export const FAUCET_URL = 'https://faucet.neptunemutual.com/'
export const ETHEREUM_APP_URL = 'https://ethereum.neptunemutual.net/'
export const ARBITRUM_APP_URL = 'https://arbitrum.neptunemutual.net/'
export const ARBITRUM_BRIDGE_URL = 'https://bridge.arbitrum.io/'

export const NetworkUrlParam = {
  97: 'bsc-testnet',
  80001: 'mumbai',
  43113: 'fuji',
  42161: 'arbitrum',
  1: ''
}

export const homeViewSelectionKey = 'view'

export const isProduction = process.env.NODE_ENV === 'production'

export const FALLBACK_NPM_TOKEN_SYMBOL = 'POT'
export const FALLBACK_NPM_TOKEN_DECIMALS = 18
export const FALLBACK_LIQUIDITY_TOKEN_SYMBOL = 'USDC'
export const FALLBACK_LIQUIDITY_TOKEN_DECIMALS = 6

export const MIN_PROPOSAL_AMOUNT = 10
export const MAX_PROPOSAL_AMOUNT = 10_000_000

export const MIN_LIQUIDITY = 10
export const MAX_LIQUIDITY = 10_000_000

export const TOP_ACCOUNTS_ROWS_PER_PAGE = 7
