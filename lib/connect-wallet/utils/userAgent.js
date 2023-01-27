import { UAParser } from 'ua-parser-js'

export function isMobile () {
  const parser = new UAParser(window.navigator.userAgent)
  const { type } = parser.getDevice()

  return type === 'mobile' || type === 'tablet'
}

export function isInjected () {
  return Boolean(window?.ethereum)
}

export function isMetaMaskInstalled () {
  return Boolean(window?.ethereum?.isMetaMask || isInjected()) ?? false
}

export function isOkxInstalled () {
  return Boolean(window?.okxwallet) ?? false
}

export function isBinanceInstalled () {
  return Boolean(window?.BinanceChain) ?? false
}
