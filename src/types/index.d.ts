export {}

declare global {
  interface Window {
    okxwallet?: any
    ethereum?: {
      request?: any
      isMetaMask?: boolean
      isCoinbaseWallet?: boolean
      providerMap?: Map<'MetaMask' | 'CoinbaseWallet', any>
    }
    BinanceChain?: any
  }
}
