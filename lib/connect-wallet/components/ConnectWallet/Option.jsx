export const Option = (props) => {
  const { id, name, Icon, onClick } = props

  const isMetamask = name.toLowerCase() === 'metamask'
  const isCoinbase = name.toLowerCase() === 'coinbase'
  const isOkx = name.toLowerCase() === 'okx wallet'
  const isBinance = name.toLowerCase() === 'binance'

  if (isMetamask) {
    if (!window.ethereum?.isMetaMask) {
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
  }

  if (isCoinbase) {
    if (
      !window.ethereum ||
      (!window.ethereum?.providers?.length && window.ethereum?.isMetaMask)
    ) {
      return (
        <a
          href='https://www.coinbase.com/wallet'
          target='_blank'
          rel='noreferrer noopener nofollow'
          className='flex items-center w-full px-6 py-4 mb-4 bg-white border rounded-lg border-d4dfee focus:border-4e7dd9 focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9'
        >
          <Icon className='mr-6' width={24} />
          <p>Install Coinbase Wallet</p>
        </a>
      )
    }
  }

  if (isOkx) {
    if (!(window.okxwallet)) {
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
  }

  if (isBinance) {
    if (!window.BinanceChain) {
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
  }

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
