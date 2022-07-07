import AvaxLogo from "@/lib/connect-wallet/components/logos/AvaxLogo";
import KovanLogo from "@/lib/connect-wallet/components/logos/KovanLogo";
import RopstenLogo from "@/lib/connect-wallet/components/logos/RopstenLogo";
import BSCLogo from "../components/logos/BSCLogo";
import EthLogo from "../components/logos/EthLogo";
import PolygonLogo from "../components/logos/PolygonLogo";
import { rpcUrls } from "./rpcUrls";

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
    chainName: "Binance Smart Chain",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: rpcUrls[56],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  {
    chainId: `0x${(97).toString(16)}`,
    chainName: "BSC Testnet",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "tBNB",
      decimals: 18,
    },
    rpcUrls: rpcUrls[97],
    blockExplorerUrls: ["https://testnet.bscscan.com"],
  },
  {
    chainId: `0x${(137).toString(16)}`,
    chainName: "Polygon",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: rpcUrls[137],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
  {
    chainId: `0x${(80001).toString(16)}`,
    chainName: "Mumbai",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: rpcUrls[80001],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
  {
    chainId: `0x${(43113).toString(16)}`,
    chainName: "Fuji",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: rpcUrls[43113],
    blockExplorerUrls: ["https://testnet.snowtrace.io/"],
  },
  {
    chainId: `0x${(1).toString(16)}`,
    chainName: "Ethereum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: rpcUrls[1],
    blockExplorerUrls: ["https://etherscan.io"],
  },
  {
    chainId: `0x${(3).toString(16)}`,
    chainName: "Ropsten",
    nativeCurrency: {
      name: "Ropsten Ether",
      symbol: "ROP",
      decimals: 18,
    },
    rpcUrls: rpcUrls[3],
    blockExplorerUrls: ["https://ropsten.etherscan.io/"],
  },
  {
    chainId: `0x${(42).toString(16)}`,
    chainName: "Kovan",
    nativeCurrency: {
      name: "Kovan Ether",
      symbol: "KOV",
      decimals: 18,
    },
    rpcUrls: rpcUrls[42],
    blockExplorerUrls: ["https://kovan.etherscan.io/"],
  },
];

export const NetworkNames = {
  56: "Binance Smart Chain",
  97: "BSC Testnet",
  137: "Polygon",
  80001: "Mumbai",
  43113: "Fuji (Avalanche C-Chain)",
  1: "Ethereum Mainnet",
  3: "Ropsten",
  42: "Kovan",
};

export const ChainLogos = {
  56: BSCLogo,
  97: BSCLogo,
  80001: PolygonLogo,
  137: PolygonLogo,
  43113: AvaxLogo,
  1: EthLogo,
  3: RopstenLogo,
  4: EthLogo,
  5: EthLogo,
  6: EthLogo,
  42: KovanLogo,
};

export const explorer = {
  address: {
    56: "https://bscscan.com/address/%s",
    97: "https://testnet.bscscan.com/address/%s",
    3: "https://ropsten.etherscan.io/address/%s",
    42: "https://kovan.etherscan.io/address/%s",
    1: "https://etherscan.io/address/%s",
    80001: "https://mumbai.polygonscan.com/address/%s",
    43113: "https://testnet.snowtrace.io/address/%s",
    137: "https://polygonscan.com/address/%s",
  },
  tx: {
    56: "https://bscscan.com/tx/%s",
    97: "https://testnet.bscscan.com/tx/%s",
    3: "https://ropsten.etherscan.io/tx/%s",
    42: "https://kovan.etherscan.io/tx/%s",
    1: "https://etherscan.io/tx/%s",
    80001: "https://mumbai.polygonscan.com/tx/%s",
    43113: "https://testnet.snowtrace.io/tx/%s",
    137: "https://polygonscan.com/tx/%s",
  },
  block: {
    56: "https://bscscan.com/block/%s",
    97: "https://testnet.bscscan.com/block/%s",
    3: "https://ropsten.etherscan.io/block/%s",
    42: "https://kovan.etherscan.io/block/%s",
    1: "https://etherscan.io/block/%s",
    80001: "https://mumbai.polygonscan.com/block/%s",
    43113: "https://testnet.snowtrace.io/block/%s",
    137: "https://polygonscan.com/block/%s",
  },
  token: {
    56: "https://bscscan.com/token/%s",
    97: "https://testnet.bscscan.com/token/%s",
    3: "https://ropsten.etherscan.io/token/%s",
    42: "https://kovan.etherscan.io/token/%s",
    1: "https://etherscan.io/token/%s",
    80001: "https://mumbai.polygonscan.com/token/%s",
    43113: "https://testnet.snowtrace.io/token/%s",
    137: "https://polygonscan.com/token/%s",
  },
};
