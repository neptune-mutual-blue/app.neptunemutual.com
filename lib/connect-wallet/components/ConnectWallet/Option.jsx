import { ConnectorNames } from '@/lib/connect-wallet/config/connectors'
import { isMobile } from '@/lib/connect-wallet/utils/userAgent'

export const Option = (props) => {
  const { id, name, Icon, onClick, connectorName, isAvailable } = props

  if (isMobile() && !isAvailable) {
    return null
  }

  if (isAvailable) {
    return (
      <button
        key={id}
        onClick={onClick}
        type='button'
        className='flex items-center w-full px-6 py-4 mb-4 bg-white border rounded-lg border-d4dfee focus:border-4e7dd9 focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9'
      >
        <Icon className='mr-6' width={24} />
        <p>{name}</p>
      </button>
    )
  }

  if (connectorName === ConnectorNames.MetaMask) {
    return (
      <a
        href='https://metamask.io/'
        target='_blank'
        rel='noreferrer noopener nofollow'
        className='flex items-center w-full px-6 py-4 mb-4 bg-white border rounded-lg border-d4dfee focus:border-4e7dd9 focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9'
      >
        <Icon className='mr-6' width={24} />
        <p>Install Metamask</p>
      </a>
    )
  }

  if (connectorName === ConnectorNames.CoinbaseWallet) {
    return (
      <a
        href='https://www.coinbase.com/wallet/downloads'
        target='_blank'
        rel='noreferrer noopener nofollow'
        className='flex items-center w-full px-6 py-4 mb-4 bg-white border rounded-lg border-d4dfee focus:border-4e7dd9 focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9'
      >
        <Icon className='mr-6' width={24} />
        <p>Install Coinbase Wallet</p>
      </a>
    )
  }

  if (connectorName === ConnectorNames.OKXWallet) {
    return (
      <a
        href='https://chrome.google.com/webstore/detail/okex-wallet/mcohilncbfahbmgdjkbpemcciiolgcge'
        target='_blank'
        rel='noreferrer noopener nofollow'
        className='flex items-center w-full px-6 py-4 mb-4 bg-white border rounded-lg border-d4dfee focus:border-4e7dd9 focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9'
      >
        <Icon className='mr-6' width={24} />
        <p>Install OKX Wallet</p>
      </a>
    )
  }

  if (connectorName === ConnectorNames.BSC) {
    return (
      <a
        href='https://docs.binance.org/smart-chain/wallet/binance.html'
        target='_blank'
        rel='noreferrer noopener nofollow'
        className='flex items-center w-full px-6 py-4 mb-4 bg-white border rounded-lg border-d4dfee focus:border-4e7dd9 focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9'
      >
        <Icon className='mr-6' width={24} />
        <p>Install Binance Wallet</p>
      </a>
    )
  }

  return null
}
