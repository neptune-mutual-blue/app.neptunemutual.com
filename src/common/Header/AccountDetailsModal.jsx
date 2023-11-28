import {
  useEffect,
  useState
} from 'react'

import {
  CopyAddressComponent
} from '@/common/CopyAddressComponent/CopyAddressComponent'
import Identicon from '@/common/Header/Identicon'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import { Toggle } from '@/common/Toggle'
import CloseIcon from '@/icons/CloseIcon'
import OpenInNewIcon from '@/icons/OpenInNewIcon'
import { ConnectorNames } from '@/lib/connect-wallet/config/connectors'
import { ACTIVE_CONNECTOR_KEY } from '@/lib/connect-wallet/config/localstorage'
import { wallets } from '@/lib/connect-wallet/config/wallets'
import { getAddressLink } from '@/lib/connect-wallet/utils/explorer'
import { useUnlimitedApproval } from '@/src/context/UnlimitedApproval'
import { Trans } from '@lingui/macro'
import * as Dialog from '@radix-ui/react-dialog'

export const AccountDetailsModal = ({
  isOpen,
  onClose,
  networkId,
  handleDisconnect,
  account
}) => {
  const { unlimitedApproval, setUnlimitedApproval } = useUnlimitedApproval()
  const [connectorName, setConnectorName] = useState(ConnectorNames.Injected)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    setConnectorName(window.localStorage.getItem(ACTIVE_CONNECTOR_KEY))
  }, [])

  const wallet = wallets.find((x) => { return x.connectorName === connectorName })

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={onClose}
      overlayClass='backdrop-blur-md'
    >
      <ModalWrapper className='max-w-lg transition-all bg-F6F7F9'>
        <Dialog.Title className='font-bold leading-9 text-black text-display-sm'>
          <Trans>Account</Trans>
        </Dialog.Title>

        <button
          onClick={onClose}
          className='absolute flex items-center justify-center text-black rounded-md top-5 right-6 sm:top-7 sm:right-12 hover:text-4E7DD9 focus:text-4E7DD9 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-transparent'
        >
          <span className='sr-only'>Close</span>
          <CloseIcon width={24} height={24} />
        </button>

        <div className='px-4 py-3.5 bg-white border mt-7 border-B0C4DB rounded-big'>
          <div className='flex flex-col-reverse items-center justify-between sm:flex-row'>
            <span className='flex items-center text-xs tracking-normal text-364253 whitespace-nowrap'>
              <span>
                <Trans>Connected with</Trans> {wallet.name}
              </span>
              <span className='ml-2'>
                <wallet.Icon width={12} height={12} />
              </span>
            </span>
            <button
              onClick={handleDisconnect}
              className='px-2 py-1 mb-2 tracking-wide uppercase border rounded-lg border-4E7DD9 sm:mb-0 sm:ml-28 md:ml-0 text-xxs text-4E7DD9'
            >
              <Trans>Disconnect</Trans>
            </button>
          </div>

          <div className='flex items-center justify-center mt-1 font-bold sm:mt-3 text-404040 sm:justify-start'>
            {account ? <Identicon /> : <div />}
            <div className='ml-3'>
              {account?.substring(0, 6) + '...' + account?.slice(-4)}
            </div>
          </div>

          <div className='flex flex-col items-center py-2 sm:items-start sm:flex-row'>
            <CopyAddressComponent account={account} />
            <a
              href={getAddressLink(networkId, account)}
              target='_blank'
              rel='noreferrer nofollow'
              className='flex items-center ml-3.5 cursor-pointer sm:ml-6'
            >
              <OpenInNewIcon width={16} height={16} fill='#999BAB' />
              <span className='text-21AD8C text-xs tracking-normal ml-2.5'>
                <Trans>View on Explorer</Trans>
              </span>
            </a>
          </div>
        </div>

        <div className='flex flex-col w-full p-5 mt-8 border border-B0C4DB rounded-big'>
          <div className='flex items-center justify-between w-full'>
            <p className='text-md text-364253'>
              <Trans>Unlimited Approvals</Trans>
            </p>
            <Toggle
              enabled={unlimitedApproval}
              setEnabled={setUnlimitedApproval}
            />
          </div>
          <p className='text-999BAB mt-3 text-xs tracking-normal leading-4.5'>
            <Trans>
              If you do not want to keep approving for each transaction, enable
              this option.
            </Trans>
          </p>
        </div>
      </ModalWrapper>
    </ModalRegular>
  )
}
