import { ConnectorNames } from '@/lib/connect-wallet/config/connectors'
import { isMobile } from '@/lib/connect-wallet/utils/userAgent'

export const Option = (props) => {
  const { id, name, Icon, onClick, connectorName, isAvailable } = props

  if (isAvailable()) {
    return (
      <button
        key={id}
        onClick={onClick}
        type='button'
        className='flex items-center w-full px-6 py-4 mb-4 bg-white border rounded-lg border-D4DFEE focus:border-4E7DD9 focus:outline-none focus-visible:ring-2 focus-visible:ring-4E7DD9'
      >
        <Icon className='mr-6' width={24} />
        <p>{name}</p>
      </button>
    )
  }

  if (connectorName === ConnectorNames.MetaMask) {
    return (
      <a
        href={`https://metamask.app.link/dapp/${typeof window === 'undefined' ? 'ethereum.neptunemutual.net' : window.location.host}`}
        target='_blank'
        rel='noreferrer noopener nofollow'
        className='flex items-center w-full px-6 py-4 mb-4 bg-white border rounded-lg border-D4DFEE focus:border-4E7DD9 focus:outline-none focus-visible:ring-2 focus-visible:ring-4E7DD9'
      >
        <Icon className='mr-6' width={24} />
        <p>Open MetaMask</p>
      </a>
    )
  }

  if (connectorName === ConnectorNames.CoinbaseWallet) {
    return (
      <a
        href='https://www.coinbase.com/wallet/downloads'
        target='_blank'
        rel='noreferrer noopener nofollow'
        className='flex items-center w-full px-6 py-4 mb-4 bg-white border rounded-lg border-D4DFEE focus:border-4E7DD9 focus:outline-none focus-visible:ring-2 focus-visible:ring-4E7DD9'
      >
        <Icon className='mr-6' width={24} />
        <p>Install Coinbase Wallet</p>
      </a>
    )
  }

  if (connectorName === ConnectorNames.OKXWallet) {
    return (
      <a
        href='https://www.okx.com/download'
        target='_blank'
        rel='noreferrer noopener nofollow'
        className='flex items-center w-full px-6 py-4 mb-4 bg-white border rounded-lg border-D4DFEE focus:border-4E7DD9 focus:outline-none focus-visible:ring-2 focus-visible:ring-4E7DD9'
      >
        <Icon className='mr-6' width={24} />
        <p>Install OKX Wallet</p>
      </a>
    )
  }

  if (connectorName === ConnectorNames.BitKeepWallet) {
    return (
      <a
        href='https://bitkeep.com/en/download?type=2'
        target='_blank'
        rel='noreferrer noopener nofollow'
        className='flex items-center w-full px-6 py-4 mb-4 bg-white border rounded-lg border-D4DFEE focus:border-4E7DD9 focus:outline-none focus-visible:ring-2 focus-visible:ring-4E7DD9'
      >
        <Icon className='mr-6' width={24} />
        <p>Install BitKeep Wallet</p>
      </a>
    )
  }

  if (!isMobile() && connectorName === ConnectorNames.BSC) {
    return (
      <a
        href='https://chrome.google.com/webstore/detail/binance-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp'
        target='_blank'
        rel='noreferrer noopener nofollow'
        className='flex items-center w-full px-6 py-4 mb-4 bg-white border rounded-lg border-D4DFEE focus:border-4E7DD9 focus:outline-none focus-visible:ring-2 focus-visible:ring-4E7DD9'
      >
        <Icon className='mr-6' width={24} />
        <p>Install Binance Wallet</p>
      </a>
    )
  }

  return null
}
