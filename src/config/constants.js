export const MULTIPLIER = 10_000

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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? new URL(process.env.NEXT_PUBLIC_API_URL).toString()
  : '/'

export const IPFS_HASH_URL = 'https://cloudflare-ipfs.com/ipfs/{ipfsHash}' // cloudflare works with cidv1 hashes like `bafkreihdaejkl4z2utvdsm7aulv5kmhjvnkpwyoosuqkz73xlkwoq2qiqa`

export const NPM_IPFS_HASH_URL = 'https://ipfs.neptunemutual.net/ipfs/{ipfsHash}'

export const BRIDGE_BALANCE_URL = `${API_BASE_URL}bridge/balance/{networkId}`

export const PRICING_URL = `${API_BASE_URL}pricing/{networkId}`

export const POOL_INFO_URL = `${API_BASE_URL}protocol/staking-pools/info/{type}/{networkId}/{key}/{account}`

export const BOND_INFO_URL = `${API_BASE_URL}protocol/bond/info/{networkId}/{account}`

export const GCR_POOLS_URL = `${API_BASE_URL}vote-escrow/gcr/pools/{networkId}`

export const VOTE_ESCROW_STATS_URL = `${API_BASE_URL}vote-escrow/stats/{networkId}`

export const UNSTAKE_INFO_URL = `${API_BASE_URL}protocol/consensus/unstake-info/{networkId}/{coverKey}/{productKey}/{account}/{incidentDate}`

export const GET_CONTRACTS_INFO_URL = `${API_BASE_URL}protocol/contracts/{networkName}`

export const VAULT_INFO_URL = `${API_BASE_URL}protocol/vault/info/{networkId}/{coverKey}/{account}`

export const POOL_URLS = {
  1: 'https://app.sushi.com/add/{liquidityTokenAddress}/{NPMTokenAddress}',
  80001: 'https://test.atlasswap.com/#/add/{liquidityTokenAddress}/{NPMTokenAddress}',
  42161: 'https://app.uniswap.org/#/add/{liquidityTokenAddress}/{NPMTokenAddress}',
  84531: 'https://app.uniswap.org/#/add/{liquidityTokenAddress}/{NPMTokenAddress}',
  43113: 'https://legacy.pangolin.exchange/#/add/{liquidityTokenAddress}/{NPMTokenAddress}'
}

export const SUBGRAPH_API_URLS = {
  // mainnet
  1: process.env.NEXT_PUBLIC_ETHEREUM_SUBGRAPH_URL,
  56: process.env.NEXT_PUBLIC_BSC_SUBGRAPH_URL,
  42161: process.env.NEXT_PUBLIC_ARBITRUM_SUBGRAPH_URL,
  // testnet
  // 43113: process.env.NEXT_PUBLIC_FUJI_SUBGRAPH_URL,
  80001: process.env.NEXT_PUBLIC_MUMBAI_SUBGRAPH_URL
  // 84531: process.env.NEXT_PUBLIC_BASE_GOERLI_SUBGRAPH_URL
}

export const TEST_URL = process.env.NEXT_PUBLIC_TEST_URL || 'https://test.neptunemutual.net'

export const FAUCET_URL = 'https://faucet.neptunemutual.com/'

export const APP_URLS = {
  1: 'https://ethereum.neptunemutual.net/',
  42161: 'https://arbitrum.neptunemutual.net/',
  56: 'https://bsc.neptunemutual.net/',
  137: 'https://polygon.neptunemutual.net/'
}

export const ARBITRUM_BRIDGE_URL = 'https://bridge.arbitrum.io/'

export const NetworkUrlParam = {
  56: 'bsc',
  97: 'bsc-testnet',
  80001: 'mumbai',
  43113: 'fuji',
  84531: 'base-goerli',
  42161: 'arbitrum',
  1: ''
}

export const isProduction = process.env.NODE_ENV === 'production'

export const MIN_PROPOSAL_AMOUNT = 10

export const MAX_PROPOSAL_AMOUNT = 10_000_000

export const MIN_LIQUIDITY = 10

export const MAX_LIQUIDITY = 10_000_000

export const TOP_ACCOUNTS_ROWS_PER_PAGE = 7

// SNAPSHOT
export const SNAPSHOT_API_URL = {
  testnet: 'https://testnet.snapshot.org/graphql',
  mainnet: 'https://hub.snapshot.org/graphql'
}

export const SNAPSHOT_INTERFACE_URL = {
  testnet: 'https://demo.snapshot.org',
  mainnet: 'https://snapshot.org'
}

export const SNAPSHOT_SPACE_ID = 'neptunemutual.eth'

export const DAYS = 24 * 60 * 60

export const WEEKS = 7 * DAYS

export const PREMATURE_UNLOCK_PENALTY_FRACTION = 0.25

export const EPOCH_DURATION = 28 * DAYS

// convertToUnits(150_000, 18).toString(). the long configuration was used because use of function was failing many tests
export const EMISSION_PER_EPOCH = '150000000000000000000000'

export const getUniswapLink = (address) => { return `https://app.uniswap.org/#/swap?inputCurrency=USDC&outputCurrency=${address}` }

export const getSushiswapLink = (usdc, address, networkId) => { return `https://www.sushi.com/swap?token0=${usdc}&token1=${address}&chainId=${networkId}` }

export const LIQUIDITY_POINTS_PER_DOLLAR = 0.0375

export const POLICY_POINTS_PER_DOLLAR = 0.00625
