import ArbitrumLogo from '@/lib/connect-wallet/components/logos/ArbitrumLogo'
import AvaxLogo from '@/lib/connect-wallet/components/logos/AvaxLogo'
import BaseGoerliLogo
  from '@/lib/connect-wallet/components/logos/BaseGoerliLogo'
import FantomLogo from '@/lib/connect-wallet/components/logos/FantomLogo'

import BSCLogo from '../components/logos/BSCLogo'
import EthLogo from '../components/logos/EthLogo'
import PolygonLogo from '../components/logos/PolygonLogo'
import { rpcUrls } from './rpcUrls'

/**
 *
 * interface AddEthereumChainParameter {
 *   chainId: string; // A 0x-prefixed hexadecimal string
 *   chainName: string;
 *   nativeCurrency: {
 *     name: string;
 *     symbol: string; // 2-6 characters long
 *     decimals: 18;
 *   };
 *   rpcUrls: string[];
 *   blockExplorerUrls?: string[];
 *   iconUrls?: string[]; // Currently ignored.
 * }
 *
 */
// Update according to https://github.com/ethereum-lists/chains
// Should strictly follow interface AddEthereumChainParameter (no additional keys can be added)
export const chains = [
  {
    chainId: `0x${(56).toString(16)}`,
    chainName: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: rpcUrls[56],
    blockExplorerUrls: ['https://bscscan.com']
  },
  {
    chainId: `0x${(97).toString(16)}`,
    chainName: 'BSC Testnet',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'tBNB',
      decimals: 18
    },
    rpcUrls: rpcUrls[97],
    blockExplorerUrls: ['https://testnet.bscscan.com']
  },
  {
    chainId: `0x${(137).toString(16)}`,
    chainName: 'Polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: rpcUrls[137],
    blockExplorerUrls: ['https://polygonscan.com/']
  },
  {
    chainId: `0x${(80001).toString(16)}`,
    chainName: 'Mumbai',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: rpcUrls[80001],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/']
  },
  {
    chainId: `0x${(43113).toString(16)}`,
    chainName: 'Fuji',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: rpcUrls[43113],
    blockExplorerUrls: ['https://testnet.snowtrace.io/']
  },
  {
    chainId: `0x${(84531).toString(16)}`,
    chainName: 'Base Goerli',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: rpcUrls[84531],
    blockExplorerUrls: ['https://goerli.basescan.org']
  },
  {
    chainId: `0x${(5).toString(16)}`,
    chainName: 'Goerli',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: rpcUrls[5],
    blockExplorerUrls: ['https://goerli.etherscan.io']
  },
  {
    chainId: `0x${(4002).toString(16)}`,
    chainName: 'Fantom Testnet',
    nativeCurrency: {
      name: 'FTM',
      symbol: 'FTM',
      decimals: 18
    },
    rpcUrls: rpcUrls[4002],
    blockExplorerUrls: ['https://testnet.ftmscan.com/']
  },
  {
    chainId: `0x${(42161).toString(16)}`,
    chainName: 'Arbitrum One',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: rpcUrls[42161],
    blockExplorerUrls: ['https://arbiscan.io/']
  },
  {
    chainId: `0x${(1).toString(16)}`,
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: rpcUrls[1],
    blockExplorerUrls: ['https://etherscan.io']
  }
]

export const NetworkNames = {
  56: 'BNB Smart Chain',
  97: 'BSC Testnet',
  137: 'Polygon',
  80001: 'Mumbai',
  43113: 'Fuji (Avalanche C-Chain)',
  84531: 'Base Goerli',
  42161: 'Arbitrum One',
  1: 'Ethereum Mainnet'
}

export const ShortNetworkNames = {
  56: 'BSC',
  97: 'BSC Testnet',
  137: 'Polygon',
  80001: 'Mumbai',
  43113: 'Fuji',
  84531: 'Base Goerli',
  42161: 'Arbitrum',
  1: 'Ethereum'
}

export const AbbreviatedNetworkNames = {
  56: 'BSC',
  97: 'BSC-T',
  137: 'Polygon',
  80001: 'Mumbai',
  43113: 'FUJ',
  84531: 'BGO',
  42161: 'ARB',
  1: 'ETH'
}

export const ChainLogos = {
  56: BSCLogo,
  97: BSCLogo,
  80001: PolygonLogo,
  137: PolygonLogo,
  43113: AvaxLogo,
  84531: BaseGoerliLogo,
  42161: ArbitrumLogo,
  4002: FantomLogo,
  1: EthLogo,
  4: EthLogo,
  5: EthLogo,
  6: EthLogo
}

export const ChainAnalyticsColors = {
  DEFAULT: '4E7DD9',
  43113: '21AD8C',
  84531: '4E7DD9',
  42161: '21AD8C',
  1: '4E7DD9',
  56: 'F3BA2F'
}

// To be compatible with tailwind opacity modifiers, this network's colors must be in rgb format.
export const ChainColorsRGB = {
  DEFAULT: '78, 125, 217',
  84531: '93, 82, 220',
  42161: '29, 154, 238',
  1: '78, 125, 217',
  56: '202, 133, 4'
}

export const explorer = {
  address: {
    56: 'https://bscscan.com/address/%s',
    97: 'https://testnet.bscscan.com/address/%s',
    1: 'https://etherscan.io/address/%s',
    80001: 'https://mumbai.polygonscan.com/address/%s',
    42161: 'https://arbiscan.io/address/%s',
    43113: 'https://testnet.snowtrace.io/address/%s',
    84531: 'https://goerli.basescan.org/address/%s',
    137: 'https://polygonscan.com/address/%s'
  },
  tx: {
    56: 'https://bscscan.com/tx/%s',
    97: 'https://testnet.bscscan.com/tx/%s',
    1: 'https://etherscan.io/tx/%s',
    80001: 'https://mumbai.polygonscan.com/tx/%s',
    42161: 'https://arbiscan.io/tx/%s',
    43113: 'https://testnet.snowtrace.io/tx/%s',
    84531: 'https://goerli.basescan.org/tx/%s',
    137: 'https://polygonscan.com/tx/%s'
  },
  block: {
    56: 'https://bscscan.com/block/%s',
    97: 'https://testnet.bscscan.com/block/%s',
    1: 'https://etherscan.io/block/%s',
    80001: 'https://mumbai.polygonscan.com/block/%s',
    42161: 'https://arbiscan.io/block/%s',
    43113: 'https://testnet.snowtrace.io/block/%s',
    84531: 'https://goerli.basescan.org/block/%s',
    137: 'https://polygonscan.com/block/%s'
  },
  token: {
    56: 'https://bscscan.com/token/%s',
    97: 'https://testnet.bscscan.com/token/%s',
    1: 'https://etherscan.io/token/%s',
    80001: 'https://mumbai.polygonscan.com/token/%s',
    42161: 'https://arbiscan.io/token/%s',
    43113: 'https://testnet.snowtrace.io/token/%s',
    84531: 'https://goerli.basescan.org/token/%s',
    137: 'https://polygonscan.com/token/%s'
  }
}
