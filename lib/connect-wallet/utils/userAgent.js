import { UAParser } from 'ua-parser-js'

export function isMobile () {
  const parser = new UAParser(window.navigator.userAgent)
  const { type } = parser.getDevice()

  return type === 'mobile' || type === 'tablet'
}

export function isMetaMaskInstalled () {
  if (!window || !window.ethereum) {
    return false
  }

  if (window.ethereum.providerMap && window.ethereum.providerMap.get('MetaMask')) {
    return true
  }

  if (window.ethereum.isMetaMask) {
    return true
  }

  return false
}

export function isOkxInstalled () {
  return Boolean(window?.okxwallet) ?? false
}

export function isCoinbaseInstalled () {
  if (!window || !window.ethereum) {
    return false
  }

  if (window.ethereum.providerMap && window.ethereum.providerMap.get('CoinbaseWallet')) {
    return true
  }

  if (window.ethereum.isCoinbaseWallet) {
    return true
  }

  return false
}

export function isBinanceInstalled () {
  return Boolean(window?.BinanceChain) ?? false
}
