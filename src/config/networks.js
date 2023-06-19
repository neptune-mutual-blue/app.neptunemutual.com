import { ChainLogos } from '@/lib/connect-wallet/config/chains'

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

export { networks }
