export const CHAINS = {
  FUJI: 43113,
  BSC: 56,
  BASE_GOERLI: 84531,
  ARBITRUM: 42161,
  ETHEREUM: 1
}

export const ChainConfig = {
  [CHAINS.ETHEREUM]: {
    npm: {
      address: '0x57f12FE6A4e5fe819eec699FAdf9Db2D06606bB4',
      tokenSymbol: 'NPM',
      tokenDecimals: 18
    },
    stablecoin: {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      tokenSymbol: 'USDC',
      tokenDecimals: 6
    },
    veNPM: {
      address: '',
      tokenSymbol: 'veNPM',
      tokenDecimals: 18
    },
    gaugeControllerRegistry: '',
    cxTokenDecimals: 18,
    vaultTokenDecimals: 18
  },
  [CHAINS.BSC]: {
    npm: {
      address: '0x57f12FE6A4e5fe819eec699FAdf9Db2D06606bB4',
      tokenSymbol: 'NPM',
      tokenDecimals: 18
    },
    stablecoin: {
      address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      tokenSymbol: 'USDC',
      tokenDecimals: 18
    },
    veNPM: {
      address: '',
      tokenSymbol: 'veNPM',
      tokenDecimals: 18
    },
    gaugeControllerRegistry: '',
    cxTokenDecimals: 18,
    vaultTokenDecimals: 18
  },
  [CHAINS.ARBITRUM]: {
    npm: {
      address: '0x57f12FE6A4e5fe819eec699FAdf9Db2D06606bB4',
      tokenSymbol: 'NPM',
      tokenDecimals: 18
    },
    stablecoin: {
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      tokenSymbol: 'USDC',
      tokenDecimals: 6
    },
    veNPM: {
      address: '',
      tokenSymbol: 'veNPM',
      tokenDecimals: 18
    },
    gaugeControllerRegistry: '',
    cxTokenDecimals: 18,
    vaultTokenDecimals: 18
  },
  [CHAINS.BASE_GOERLI]: {
    npm: {
      address: '0x4BbDc138dd105C7ddE874df7FCd087b064F7973d',
      tokenSymbol: 'NPM',
      tokenDecimals: 18
    },
    stablecoin: {
      address: '0xbdCDBD278467b84F67AEE5737Ddc83A9C054cC29',
      tokenSymbol: 'USDC',
      tokenDecimals: 6
    },
    veNPM: {
      address: '0x9Cfef27aC2Bed8689B89De0Ad7B30B02f5F45f9A',
      tokenSymbol: 'veNPM',
      tokenDecimals: 18
    },
    gaugeControllerRegistry: '0x3bA2F20FF5481451E37Cfc97f50250aB10CAd8eF',
    neptuneLegends: '0xd673f97cA6DC3f807E0EAA9d0271b165C2A6d657',
    policyProofMinter: '0xbF7176F75B73DF752F52f429AF853A5f7edBb1FA',
    merkleProofMinter: '0x0866f9927d94a5D7072E91DcF77E407099170Bf5',
    cxTokenDecimals: 18,
    vaultTokenDecimals: 18
  }
}
