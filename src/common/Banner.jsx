import CloseIcon from '@/icons/CloseIcon'
import { NetworkNames } from '@/lib/connect-wallet/config/chains'

import { FAUCET_URL, TEST_URL } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'

import { t, Trans } from '@lingui/macro'
import { classNames } from '@/utils/classnames'
import { useLocalStorage } from '@/src/hooks/useLocalStorage'

export const Banner = () => {
  const { networkId } = useNetwork()
  const { isMainNet } = useValidateNetwork(networkId)
  const [show, setShow] = useLocalStorage('showAnnouncement', true)

  if (!networkId) {
    return null
  }

  const handleClose = () => {
    setShow(false)
  }

  if (!show) return null

  return (
    <div className={classNames('relative', isMainNet ? 'bg-4e7dd9' : 'bg-5D52DC')} data-testid='banner-container'>
      <div className='flex items-center justify-center p-3 mx-auto my-0 text-sm text-white lg:py-3 max-w-7xl lg:px-7'>
        <div className='flex items-center justify-center flex-auto min-w-0'>

          {isMainNet
            ? (
              <p>
                Searching for the testnet app? {' '}
                <a
                  className='underline'
                  href={TEST_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                  data-testid='faucet-link'
                >
                  <Trans>click here</Trans>
                </a>
              </p>
              )
            : (
              <p>
                <Trans>
                  You&#x2019;re on {NetworkNames[networkId]} Network. Get{' '}
                  <a
                    className='underline'
                    href={FAUCET_URL}
                    target='_blank'
                    rel='noopener noreferrer'
                    data-testid='faucet-link'
                  >
                    Test Tokens
                  </a>.
                </Trans>
              </p>
              )}
        </div>
        <button
          type='button'
          aria-label='Close'
          onClick={handleClose}
          className={classNames('block p-1 ml-auto')}
          title={t`close`}
          data-testid='close-banner'
        >
          <CloseIcon className='w-5 h-5' />
        </button>
      </div>
    </div>
  )
}
