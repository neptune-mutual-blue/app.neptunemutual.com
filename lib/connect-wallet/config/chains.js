import BSCLogo from "../components/logos/BSCLogo";
import EthLogo from "../components/logos/EthLogo";
import PolygonLogo from "../components/logos/PolygonLogo";
import { rpcUrls } from "./rpcUrls";

// Update according to https://github.com/ethereum-lists/chains
// Try to match as much as possible
export const chains = [
  {
    id: 56,
    chainId: `0x${(56).toString(16)}`,
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: rpcUrls[56],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  {
    id: 97,
    chainId: `0x${(97).toString(16)}`,
    chainName: "Binance Smart Chain Testnet",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "tBNB",
      decimals: 18,
    },
    rpcUrls: rpcUrls[97],
    blockExplorerUrls: ["https://testnet.bscscan.com"],
  },
  {
    id: 137,
    chainId: `0x${(137).toString(16)}`,
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: rpcUrls[137],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
  {
    id: 80001,
    chainId: `0x${(80001).toString(16)}`,
    chainName: "Polygon Testnet Mumbai",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: rpcUrls[80001],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
  {
    id: 1,
    chainId: `0x${(1).toString(16)}`,
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: rpcUrls[1],
    blockExplorerUrls: ["https://etherscan.io"],
  },
  {
    id: 3,
    chainId: `0x${(3).toString(16)}`,
    chainName: "Ropsten Testnet",
    nativeCurrency: {
      name: "Ropsten Ether",
      symbol: "ROP",
      decimals: 18,
    },
    rpcUrls: rpcUrls[3],
    blockExplorerUrls: ["https://ropsten.etherscan.io/"],
  },
];

export const NetworkNames = {
  56: "BSC Mainnet",
  97: "BSC Testnet",
  137: "Polygon Mainnet",
  80001: "Polygon Testnet Mumbai",
  1: "Ethereum Mainnet",
  3: "Ropsten Testnet",
};

export const ChainLogos = {
  56: BSCLogo,
  97: BSCLogo,
  80001: PolygonLogo,
  137: PolygonLogo,
  1: EthLogo,
  3: EthLogo,
  4: EthLogo,
  5: EthLogo,
  6: EthLogo,
};

export const explorer = {
  address: {
    56: "https://bscscan.com/address/",
    97: "https://testnet.bscscan.com/address/",
    3: "https://ropsten.etherscan.io/address/",
    1: "https://etherscan.io/address/",
    80001: "https://mumbai.polygonscan.com/address/",
    137: "https://polygonscan.com/address/",
  },
};
