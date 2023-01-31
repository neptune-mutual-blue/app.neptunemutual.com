export {}

declare global {
  interface Window {
    okxwallet?: any
    ethereum?: {
      on?: any
      autoRefreshOnNetworkChange?: boolean
      request?: any
      send?: any
      enable?: any
      removeListener?: any
      isDapper?: any
      cachedResults?: any
      chainId?: any
      netVersion?: any
      networkVersion?: any
      _chainId?: any
      isMetaMask?: boolean
      isCoinbaseWallet?: boolean
      providerMap?: Map<'MetaMask' | 'CoinbaseWallet', any>
    }
    BinanceChain?: any
  }
}
