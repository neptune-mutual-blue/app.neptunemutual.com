import { Option } from './Option'

export const WalletList = ({ wallets, onConnect }) => {
  const availableWallets = wallets.filter(x => x.isAvailable())

  if (availableWallets.length === 0) {
    return (
      <div className='mt-8 text-sm font-normal text-black'>
        No wallets found
      </div>
    )
  }

  return (
    <div className='mt-8 text-sm font-normal text-black'>
      {wallets.map((wallet) => (
        <Option
          key={wallet.id}
          onClick={() => {
            onConnect(wallet.id)
          }}
          {...wallet}
        />
      ))}
    </div>
  )
}
