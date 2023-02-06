import { UAParser } from 'ua-parser-js'

export function isMobile () {
  const parser = new UAParser(window.navigator.userAgent)
  const { type } = parser.getDevice()

  return type === 'mobile' || type === 'tablet'
}
