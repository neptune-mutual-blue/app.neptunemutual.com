const getSubdomain = (hostname = '') => {
  try {
    const urlParts = hostname.split('.')
    const subdomain = urlParts.length >= 3 ? urlParts.slice(0, -2).join('.') : ''

    return subdomain
  } catch (error) { }

  return ''
}

export const detectChainId = (host = '') => {
  // host format - subdomain.domain.com
  const subdomain = getSubdomain(host)

  switch (subdomain) {
    case 'safe.app':
    case 'app':
    case 'ethereum':
      return '1'
    case 'mumbai':
      return '80001'
    case 'fuji':
      return '43113'
    case 'safe.arbitrum':
    case 'arbitrum':
      return '42161'
    case 'bsctest':
      return '97'
    case 'bsc':
      return '56'
    case 'polygon':
      return '137'

    default:
      return process.env.NEXT_PUBLIC_FALLBACK_NETWORK || '84531'
  }
}
