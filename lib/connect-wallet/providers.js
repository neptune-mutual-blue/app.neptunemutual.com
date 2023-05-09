export const getInjectedProvider = () => {
  if (typeof window === 'undefined' || !window || !window.ethereum) {
    return undefined
  }

  if (
    (window.ethereum.providerMap &&
      !window.ethereum.providerMap.get('MetaMask') &&
      !window.ethereum.providerMap.get('CoinbaseWallet')) ||
    (!window.ethereum.isMetaMask && !window.ethereum.isCoinbaseWallet)
  ) {
    return window.ethereum
  }

  return undefined
}

export const getMetaMaskProvider = () => {
  if (typeof window === 'undefined' || !window || !window.ethereum) {
    return undefined
  }

  if (window.ethereum.providerMap && window.ethereum.providerMap.get('MetaMask')) {
    return window.ethereum.providerMap.get('MetaMask')
  }

  if (window.ethereum.isMetaMask) {
    return window.ethereum
  }

  return undefined
}

export const getOkxWalletProvider = () => {
  if (typeof window === 'undefined' || !window || !window.okxwallet) {
    return undefined
  }

  if (window.okxwallet) {
    return window.okxwallet
  }

  return undefined
}

export const getBinanceWalletProvider = () => {
  if (typeof window === 'undefined' || !window || !window.BinanceChain) {
    return undefined
  }

  if (window.BinanceChain) {
    return window.BinanceChain
  }

  return undefined
}

export const getCoinbaseWalletProvider = () => {
  if (typeof window === 'undefined' || !window || !window.ethereum) {
    return undefined
  }

  if (window.ethereum.providerMap && window.ethereum.providerMap.get('CoinbaseWallet')) {
    return window.ethereum.providerMap.get('CoinbaseWallet')
  }

  if (window.ethereum.isCoinbaseWallet) {
    return window.ethereum
  }

  if (window.coinbaseWalletExtension) {
    return window.coinbaseWalletExtension
  }

  return undefined
}

export const getBitKeepWalletProvider = () => {
  if (typeof window === 'undefined' || !window) {
    return undefined
  }

  if (window.bitkeep && window.bitkeep.ethereum) {
    return window.bitkeep.ethereum
  }

  return undefined
}
