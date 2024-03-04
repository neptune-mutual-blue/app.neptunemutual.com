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
import {
  ChainLogos,
  NetworkNames
} from '@/lib/connect-wallet/config/chains'
import { Routes } from '@/src/config/routes'
import { useNetwork } from '@/src/context/Network'
import { useOnClickOutside } from '@/src/hooks/useClickOutside'
import { useWindowSize } from '@/src/hooks/useWindowSize'
import { classNames } from '@/utils/classnames'
import { Menu } from '@headlessui/react'
import {
  Content,
  Overlay,
  Portal,
  Root
} from '@radix-ui/react-dialog'

export const Network = () => {
  const { networkId } = useNetwork()
  const { width } = useWindowSize()

  const [open, setOpen] = useState(false)

  const networks = useMemo(() => {
    return [
      {
        title: 'Ethereum Mainnet',
        networkId: 1,
        active: networkId === 1,
        Icon: ChainLogos[1]
      },
      {
        title: 'Arbitrum One',
        networkId: 42161,
        active: networkId === 42161,
        Icon: ChainLogos[42161]
      },
      {
        title: 'BNB Smart Chain',
        networkId: 56,
        active: networkId === 56,
        Icon: ChainLogos[56]
      },
      {
        title: 'Polygon',
        networkId: 137,
        active: networkId === 137,
        Icon: ChainLogos[137]
      }
    ]
  }, [networkId])

  const ref = useRef()
  useOnClickOutside(ref, () => {
    if (open && width >= 768) { setOpen(false) }
  })

  const handleKeyPress = useCallback((e) => {
    if (!open || width < 768) { return }

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

  const ChainLogo = ChainLogos[networkId || 1] || ChainLogos[1]

  const Button = ({ modalOpen }) => {
    return (
      width < 768
        ? (
          <button
            onClick={() => {
              if (width < 768) { return setOpen(_val => { return !_val }) }
            }}
            className={classNames(
              'p-1 md:h-10 md:p-2.5 rounded-2 flex gap-1 items-center'
            )}
          >
            <figure
              className='flex-shrink-0 overflow-hidden rounded-full'
              title={NetworkNames[networkId] || 'Network'}
            >
              <ChainLogo width='24' height='24' />
            </figure>

            <ChevronDownIcon
              width='16' height='16'
              className={classNames('flex-shrink-0 transform hidden md:block', modalOpen && 'rotate-180')}
            />
          </button>
          )
        : (
          <Menu.Button
            className={classNames(
              'p-1 md:h-10 md:p-2.5 rounded-2 flex gap-1 items-center'
            )}
          >
            <figure
              className='flex-shrink-0 overflow-hidden rounded-full'
              title={NetworkNames[networkId] || 'Network'}
            >
              <ChainLogo width='24' height='24' />
            </figure>

            <ChevronDownIcon
              width='16' height='16'
              className={classNames('flex-shrink-0 transform hidden md:block', modalOpen && 'rotate-180')}
            />
          </Menu.Button>
          )
    )
  }

  return (
    <div
      className='inline-flex items-center justify-start text-sm font-normal leading-loose rounded-lg md:justify-center md:w-auto text-FEFEFF bg-364253'
    >
      <div className='relative w-full' ref={ref}>
        <Menu>
          {
            ({ open: modalOpen }) => {
              return (
                <div className='relative'>
                  <Button modalOpen={modalOpen} />

                  <Menu.Items
                    className='absolute right-0 hidden py-4 border rounded-lg min-w-250 top-dropdown bg-FEFEFF border-B0C4DB shadow-dropdown md:block'
                  >

                    <div className='space-y-1 text-000000'>
                      <p className='px-4 text-sm font-semibold leading-6'>
                        Switch Network
                      </p>
                      {
                      networks.map((network, i) => {
                        return (
                          <Menu.Item key={i}>
                            {
                            ({ active: activeState }) => {
                              return (
                                <a
                                  className={classNames(
                                    'flex items-center gap-1.5 justify-between px-4 py-1.5',
                                    activeState && 'bg-344054 bg-opacity-20'
                                  )}
                                  href={Routes.Home(network.networkId)}
                                  tabIndex={0}
                                >
                                  <div className='flex items-center gap-1.5'>
                                    <div className='flex items-center justify-center w-4 h-4 overflow-hidden rounded-full'>
                                      <network.Icon width='32' height='32' />
                                    </div>
                                    <span className='text-sm leading-6'>{network.title}</span>
                                  </div>

                                  {
                                  network.active && (
                                    <CheckCircleFilledIcon className='w-4 h-4 text-4E7DD9' />
                                  )
                                }
                                </a>
                              )
                            }
                          }
                          </Menu.Item>
                        )
                      })
                    }
                    </div>
                  </Menu.Items>
                </div>
              )
            }
          }
        </Menu>

        <NetworkModalMobile
          open={open && width < 768}
          onClose={() => { return setOpen(false) }}
          networks={networks}
          closeMobileMenu={() => { return setOpen(false) }}
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
                className='-ml-4 p-4 flex items-center gap-2.5 text-white text-md leading-5 uppercase'
                onClick={onClose}
              >
                <LeftArrow />
                <span>Back</span>
              </button>

              <ul className='mt-8 text-white'>
                <p className='font-semibold leading-6 text-md md:text-display-sm'>
                  Switch Network
                </p>

                <div className='mt-6 space-y-4 md:mt-10 md:space-y-6'>
                  {
                    networks.map((network, i) => {
                      return (
                        <li key={i}>
                          <a
                            className='flex items-center gap-2'
                            href={Routes.Home(network.networkId)}
                            tabIndex={0}
                          >
                            <div className='flex items-center justify-center w-8 h-8 overflow-hidden rounded-full'>
                              <network.Icon width='32' height='32' />
                            </div>
                            <span className='leading-6 text-md md:text-display-sm'>{network.title}</span>

                            {
                            network.active && (
                              <CheckCircleFilledIcon className='w-5 h-5 text-4E7DD9' />
                            )
                          }
                          </a>
                        </li>
                      )
                    })
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
