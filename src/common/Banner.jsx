import { NavContainer } from '@/common/Container/NavContainer'
import CloseIcon from '@/icons/CloseIcon'
import { NetworkNames } from '@/lib/connect-wallet/config/chains'
import {
  APP_URLS,
  ARBITRUM_BRIDGE_URL,
  FAUCET_URL
} from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { useLocalStorage } from '@/src/hooks/useLocalStorage'
import { classNames } from '@/utils/classnames'
import { getNetworkInfo } from '@/utils/network'
import {
  t,
  Trans
} from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const Banner = () => {
  const { networkId } = useNetwork()
  const { isMainNet, isEthereum, isArbitrum } = getNetworkInfo(networkId)
  const [show, setShow] = useLocalStorage('showAnnouncement', true)

  const { i18n } = useLingui()

  if (!networkId) {
    return null
  }

  const handleClose = () => {
    setShow(false)
  }

  if (!show) { return null }
  if (isMainNet && !(isEthereum || isArbitrum)) { return null }

  return (
    <div
      className='relative bg-primary'
      data-testid='banner-container'
    >
      <NavContainer className='py-3 mx-auto my-0 text-sm text-white'>
        <div className='flex items-center justify-center xl:px-18'>
          <div className='flex items-center justify-center flex-auto min-w-0'>
            {isEthereum && (
              <p>
                <Trans>
                  Ethereum gas fees too high? {' '}
                  <a
                    className='underline'
                    href={APP_URLS[42161]}
                  >
                    Use Neptune Mutual on Arbitrum
                  </a>
                </Trans>
              </p>
            )}

            {isArbitrum && (
              <p>
                <Trans>
                  Don't have Arbitrum ETH?{' '}
                  <a
                    className='underline'
                    href={APP_URLS[1]}
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
            )}

            {!isMainNet && (
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
            title={t(i18n)`close`}
            data-testid='close-banner'
          >
            <CloseIcon className='w-5 h-5' />
          </button>
        </div>
      </NavContainer>
    </div>
  )
}
