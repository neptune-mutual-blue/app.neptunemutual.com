export const detectChainId = (host = '') => {
  // host format - subdomain.domain.com
  const parts = host.split('.')

  switch (parts[0]) {
    case 'app':
    case 'eth':
      return '1'
    case 'mumbai':
      return '80001'
    case 'fuji':
      return '43113'
    case 'bsctest':
      return '97'
    case 'bsc':
      return '56'
    case 'polygon':
      return '137'

    default:
      return process.env.NEXT_PUBLIC_FALLBACK_NETWORK || '43113'
  }
}
