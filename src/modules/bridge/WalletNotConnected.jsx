import { RegularButton } from '@/common/Button/RegularButton'
import ConnectWallet from '@/lib/connect-wallet/components/ConnectWallet/ConnectWallet'
import { useNetwork } from '@/src/context/Network'
import { classNames } from '@/utils/classnames'

export const WalletNotConnected = ({ className = '' }) => {
  const { networkId } = useNetwork()

  return (
    <div className={classNames('p-4 rounded-big border border-D6D6D6 text-center', className)}>
      <p className='font-semibold text-404040 text-md'>Wallet Not Connected</p>
      <p className='mt-1 text-sm text-404040'>Connect your wallet to use this feature.</p>

      <ConnectWallet networkId={networkId} notifier={console.log}>
        {({ onOpen }) => {
          return (
            <RegularButton className='w-full p-4 mt-4 font-semibold uppercase rounded-big text-md' onClick={onOpen}>
              Connect wallet to bridge
            </RegularButton>
          )
        }}
      </ConnectWallet>
    </div>
  )
}
