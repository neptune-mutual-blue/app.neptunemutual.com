export const MULTIPLIER = 10_000
export const DAYS = 86400

export const DEFAULT_GAS_LIMIT = '6000000'
export const ADDRESS_ONE = '0x0000000000000000000000000000000000000001'
export const ROWS_PER_PAGE = 50
export const CARDS_PER_PAGE = 6
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
export const PRICING_URL = `${API_BASE_URL}pricing/{networkId}`
export const POOL_INFO_URL = `${API_BASE_URL}protocol/staking-pools/info/{type}/{networkId}/{key}/{account}`
export const UNSTAKE_INFO_URL = `${API_BASE_URL}protocol/consensus/unstake-info/{networkId}/{coverKey}/{productKey}/{account}/{incidentDate}`
export const BOND_INFO_URL = `${API_BASE_URL}protocol/bond/info/{networkId}/{account}`
export const GET_CONTRACTS_INFO_URL = `${API_BASE_URL}protocol/contracts/{networkName}`
export const COVER_STATS_URL = `${API_BASE_URL}protocol/cover/stats/{networkId}/{coverKey}/{productKey}/{account}`
export const VAULT_INFO_URL = `${API_BASE_URL}protocol/vault/info/{networkId}/{coverKey}/{account}`
export const REFERRAL_CODE_VALIDATION_URL = `${API_BASE_URL}protocol/cover/referral-code`

export const FAUCET_URL = 'https://faucet.neptunemutual.com/'
export const LEADERBOARD_URL = 'https://leaderboard.neptunemutual.com/'

export const POOL_URLS = {
  1: 'https://app.sushi.com/add/{liquidityTokenAddress}/{NPMTokenAddress}',
  3: 'https://app.sushi.com/add/{liquidityTokenAddress}/{NPMTokenAddress}',
  42: 'https://app.sushi.com/add/{liquidityTokenAddress}/{NPMTokenAddress}',
  80001:
    'https://legacy.quickswap.exchange/#/add/{liquidityTokenAddress}/{NPMTokenAddress}',
  43113:
    'https://legacy.pangolin.exchange/#/add/{liquidityTokenAddress}/{NPMTokenAddress}'
}

export const SUBGRAPH_API_URLS = {
  1: process.env.NEXT_PUBLIC_ETHEREUM_SUBGRAPH_URL,
  3: process.env.NEXT_PUBLIC_ROPSTEN_SUBGRAPH_URL,
  42: process.env.NEXT_PUBLIC_KOVAN_SUBGRAPH_URL,
  80001: process.env.NEXT_PUBLIC_MUMBAI_SUBGRAPH_URL,
  43113: process.env.NEXT_PUBLIC_FUJI_SUBGRAPH_URL
}

export const TEST_URL = process.env.NEXT_PUBLIC_TEST_URL || 'https://test.neptunemutual.com'

export const NetworkUrlParam = {
  97: 'bsc-testnet',
  80001: 'mumbai',
  43113: 'fuji',
  1: '',
  3: 'ropsten'
}

export const homeViewSelectionKey = 'view'

export const isProduction = process.env.NODE_ENV === 'production'

export const FALLBACK_NPM_TOKEN_SYMBOL = 'POT'
export const FALLBACK_NPM_TOKEN_DECIMALS = 18
export const FALLBACK_LIQUIDITY_TOKEN_SYMBOL = 'USDC'
export const FALLBACK_LIQUIDITY_TOKEN_DECIMALS = 6
