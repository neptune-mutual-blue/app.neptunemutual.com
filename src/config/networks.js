import { ChainLogos } from '@/lib/connect-wallet/config/chains'

const supportedNetworks = [
  1, // Ethereum Mainnet
  56, // BNB Smart Chain Mainnet
  137, // Polygon Mainnet
  42161, // Arbitrum One Mainnet
  43113, // Fuji Testnet
  80001 // Mumbai Testnet
]

const networkIdToSlug = {
  1: 'ethereum',
  56: 'bsc',
  137: 'polygon',
  42161: 'arbitrum',
  43113: 'fuji',
  80001: 'mumbai'
}

const slugToNetworkId = {
  ethereum: 1,
  bsc: 56,
  polygon: 137,
  arbitrum: 42161,
  fuji: 43113,
  mumbai: 80001
}

const enabledFeatures = {
  1: process.env.NEXT_PUBLIC_ETHEREUM_FEATURES,
  56: process.env.NEXT_PUBLIC_BSC_FEATURES,
  137: process.env.NEXT_PUBLIC_POLYGON_FEATURES,
  42161: process.env.NEXT_PUBLIC_ARBITRUM_FEATURES,
  43113: process.env.NEXT_PUBLIC_FUJI_FEATURES,
  80001: process.env.NEXT_PUBLIC_MUMBAI_FEATURES
}

const networks = {
  mainnet: [
    {
      chainId: 1,
      name: 'Ethereum',
      Logo: ChainLogos[1]
    },
    {
      chainId: 42161,
      name: 'Arbitrum One',
      Logo: ChainLogos[42161]
    },
    {
      chainId: 137,
      name: 'Polygon',
      Logo: ChainLogos[137]
    },
    {
      chainId: 56,
      name: 'BNB Smart Chain',
      Logo: ChainLogos[56]
    }
  ],
  testnet: [
    {
      chainId: 97,
      name: 'BSC Testnet',
      Logo: ChainLogos[97]
    },
    {
      chainId: 80001,
      name: 'Mumbai',
      Logo: ChainLogos[80001]
    },
    {
      chainId: 43113,
      name: 'Fuji (Avalanche C-Chain)',
      Logo: ChainLogos[43113]
    },
    {
      chainId: 84531,
      name: 'Base Goerli',
      Logo: ChainLogos[84531]
    },
    {
      chainId: 5,
      name: 'Goerli',
      Logo: ChainLogos['5']
    },
    {
      chainId: 4002,
      name: 'Fantom Testnet',
      Logo: ChainLogos[4002]
    }
  ]
}

export {
  enabledFeatures,
  networkIdToSlug,
  networks,
  slugToNetworkId,
  supportedNetworks
}
