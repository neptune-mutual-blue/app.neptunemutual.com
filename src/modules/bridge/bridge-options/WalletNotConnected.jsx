import { RegularButton } from '@/common/Button/RegularButton'
import ConnectWallet
  from '@/lib/connect-wallet/components/ConnectWallet/ConnectWallet'
import { useNetwork } from '@/src/context/Network'

export const WalletNotConnected = () => {
  const { networkId } = useNetwork()

  return (
    <div className='p-4 text-center'>
      <h2 className='text-xl font-semibold text-404040'>Wallet Not Connected</h2>
      <p className='mt-1 text-sm text-404040'>Connect your wallet to use this feature.</p>

      <ConnectWallet networkId={networkId} notifier={console.log}>
        {({ onOpen }) => {
          return (
            <RegularButton className='w-full max-w-xs p-4 mt-4 font-semibold rounded-big text-md' onClick={onOpen}>
              Connect wallet to bridge
            </RegularButton>
          )
        }}
      </ConnectWallet>
    </div>
  )
}
