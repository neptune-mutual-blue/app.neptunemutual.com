import CloseIcon from '@/icons/CloseIcon'
import { NetworkNames } from '@/lib/connect-wallet/config/chains'
import {
  ARBITRUM_APP_URL,
  ARBITRUM_BRIDGE_URL,
  ETHEREUM_APP_URL,
  FAUCET_URL
} from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { useLocalStorage } from '@/src/hooks/useLocalStorage'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'
import { classNames } from '@/utils/classnames'
import {
  t,
  Trans
} from '@lingui/macro'

export const Banner = () => {
  const { networkId } = useNetwork()
  const { isMainNet, isEthereum } = useValidateNetwork(networkId)
  const [show, setShow] = useLocalStorage('showAnnouncement', true)

  if (!networkId) {
    return null
  }

  const handleClose = () => {
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      className='relative bg-custom-theme'
      data-testid='banner-container'
    >
      <div className='flex items-center justify-center p-3 mx-auto my-0 text-sm text-white lg:py-3 max-w-7xl lg:px-7'>
        <div className='flex items-center justify-center flex-auto min-w-0'>

          {isMainNet
            ? (
                isEthereum
                  ? (
                    <p>
                      <Trans>
                        Ethereum gas fees too high? {' '}
                        <a
                          className='underline'
                          href={ARBITRUM_APP_URL}
                        >
                          Use Neptune Mutual on Arbitrum
                        </a>
                      </Trans>
                    </p>
                    )
                  : (
                    <p>
                      <Trans>
                        Don't have Arbitrum ETH?{' '}
                        <a
                          className='underline'
                          href={ETHEREUM_APP_URL}
                        >
                          Use Neptune Mutual on Ethereum
                        </a>{' '}
                        or{' '}
                        <a
                          className='underline'
                          href={ARBITRUM_BRIDGE_URL}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          Bridge ETH and USDC to Arbitrum
                        </a>
                      </Trans>
                    </p>
                    )
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
