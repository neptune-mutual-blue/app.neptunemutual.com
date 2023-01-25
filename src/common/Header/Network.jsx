import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import { BurgerMenu } from '@/common/BurgerMenu/BurgerMenu'
import CheckCircleFilledIcon from '@/icons/CheckCircleFilledIcon'
import ChevronDownIcon from '@/icons/ChevronDownIcon'
import LeftArrow from '@/icons/LeftArrow'
import ArbitrumLogo from '@/lib/connect-wallet/components/logos/ArbitrumLogo'
import EthLogo from '@/lib/connect-wallet/components/logos/EthLogo'
import {
  ChainLogos,
  NetworkNames
} from '@/lib/connect-wallet/config/chains'
import {
  ARBITRUM_APP_URL,
  ETHEREUM_APP_URL
} from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { useOnClickOutside } from '@/src/hooks/useClickOutside'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'
import { useWindowSize } from '@/src/hooks/useWindowSize'
import { classNames } from '@/utils/classnames'
import {
  Content,
  Overlay,
  Portal,
  Root
} from '@radix-ui/react-dialog'

export const Network = ({ closeMenu = () => {} }) => {
  const { networkId } = useNetwork()
  const { isEthereum, isArbitrum } = useValidateNetwork(networkId)
  const { width } = useWindowSize()

  const [open, setOpen] = useState(false)

  const networks = useMemo(() => [
    {
      name: 'Ethereum Mainnet',
      value: 'ethereum',
      href: ETHEREUM_APP_URL,
      Icon: EthLogo,
      active: isEthereum
    },
    {
      name: 'Arbitrum One',
      value: 'arbitrum',
      href: ARBITRUM_APP_URL,
      Icon: ArbitrumLogo,
      active: isArbitrum
    }
  ], [isEthereum, isArbitrum])

  const ref = useRef()
  useOnClickOutside(ref, () => {
    if (open && width >= 1200) setOpen(false)
  })

  const handleKeyPress = useCallback((e) => {
    if (!open || width < 1200) return

    if (e.key === 'Escape' || e.code === 'Escape') {
      setOpen(false)
    }
  }, [open, width])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  const ChainLogo = ChainLogos[networkId] || ChainLogos[1]

  return (
    <div
      className='inline-flex items-center justify-start w-full mr-2 text-sm font-normal leading-loose rounded-lg xl:justify-center md:mr-4 xl:w-auto xl:mr-0 text-FEFEFF bg-364253'
    >
      <figure
        className={classNames(
          'overflow-hidden flex-shrink-0',
          width >= 1200 && width <= 1439 ? 'rounded-lg' : 'rounded-l-lg'
        )}
        title={NetworkNames[networkId] || 'Network'}
      >
        <span className='block lg:hidden xl:block'>
          <ChainLogo width='44' height='44' />{' '}
        </span>
        <span className='hidden lg:block xl:hidden'>
          <ChainLogo width='64' height='64' />{' '}
        </span>
      </figure>

      <div className='relative w-full' ref={ref}>
        <button
          onClick={() => setOpen(_val => !_val)}
          className={classNames(
            'w-full flex items-center justify-between gap-2 px-3 py-2 lg:py-4 xl:py-2',
            width >= 1200 && width <= 1439 && 'hidden'
          )}
        >
          <p className='inline-block w-full text-left truncate'>
            {NetworkNames[networkId] || 'Network'}
          </p>

          <ChevronDownIcon
            width='16' height='16'
            className={classNames('flex-shrink-0 transform', open && 'rotate-180')}
          />
        </button>

        {
          (open && width >= 1200) && (
            <ul
              className='absolute right-0 hidden p-6 border rounded-lg min-w-250 top-dropdown bg-FEFEFF border-B0C4DB shadow-dropdown xl:block'
              tabIndex={-1}
            >
              {/* <div className='pb-4 space-y-2 border-b text-000000 border-B0C4DB'> */}
              <div className='space-y-2 text-000000'>
                <p className='text-sm font-semibold leading-6 font-poppins'>
                  Switch Network
                </p>
                {
                    networks.map(({ name, href, Icon, active }, i) => (
                      <li key={i} value={name}>
                        <a
                          className='flex items-center gap-1.5 justify-between'
                          href={href}
                          tabIndex={0}
                        >
                          <div className='flex items-center gap-1.5'>
                            <div className='flex items-center justify-center w-4 h-4 overflow-hidden rounded-full'>
                              <Icon width='32' height='32' />
                            </div>
                            <span className='text-sm leading-6 font-poppins'>{name}</span>
                          </div>

                          {
                            active && (
                              <CheckCircleFilledIcon className='w-4 h-4' />
                            )
                          }
                        </a>
                      </li>
                    ))
                  }
              </div>
            </ul>
          )
        }

        <NetworkModalMobile
          open={open && width < 1200}
          onClose={() => setOpen(false)}
          networks={networks}
          closeMobileMenu={closeMenu}
        />
      </div>

    </div>
  )
}

const NetworkModalMobile = ({ open, onClose, networks, closeMobileMenu }) => {
  return (
    <div>
      <Root open={open} onOpenChange={onClose}>
        <Portal className='xl:hidden'>
          <Overlay className='fixed inset-0 z-50 bg-black bg-opacity-80 backdrop-blur-md' />

          <Content className='fixed inset-0 w-full max-h-screen z-60'>
            <div className='absolute right-6 top-6'>
              <BurgerMenu isOpen onToggle={closeMobileMenu} />
            </div>

            <div className='px-10 pb-10 md:px-27 mt-14'>
              <button
                className='-ml-4 p-4 flex items-center gap-2.5 text-white font-poppins text-h5 leading-5 uppercase'
                onClick={onClose}
              >
                <LeftArrow />
                <span>Back</span>
              </button>

              <ul className='mt-8 text-white'>
                <p className='font-semibold leading-6 text-md md:text-h2 font-poppins'>
                  Switch Network
                </p>

                <div className='mt-6 space-y-4 md:mt-10 md:space-y-6'>
                  {
                    networks.map(({ name, href, Icon, active }, i) => (
                      <li key={i} value={name}>
                        <a
                          className='flex items-center gap-2'
                          href={href}
                          tabIndex={0}
                        >
                          <div className='flex items-center justify-center w-8 h-8 overflow-hidden rounded-full'>
                            <Icon width='32' height='32' />
                          </div>
                          <span className='leading-6 text-md md:text-h2 font-poppins'>{name}</span>

                          {
                            active && (
                              <CheckCircleFilledIcon className='w-5 h-5' />
                            )
                          }
                        </a>
                      </li>
                    ))
                  }
                </div>
              </ul>
            </div>
          </Content>
        </Portal>
      </Root>
    </div>
  )
}
