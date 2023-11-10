import {
  useEffect,
  useMemo,
  useState
} from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { Banner } from '@/common/Banner'
import { BurgerMenu } from '@/common/BurgerMenu/BurgerMenu'
import { NavContainer } from '@/common/Container/NavContainer'
import { AccountDetailsModal } from '@/common/Header/AccountDetailsModal'
import {
  getFlattenedNavLinks,
  getNavigationLinks
} from '@/common/Header/getNavigationLinks'
import { LanguageDropdown } from '@/common/Header/LanguageDropdown'
import { Network } from '@/common/Header/Network'
import { HeaderLogo } from '@/common/HeaderLogo'
import { IconWithBadge } from '@/common/IconWithBadge'
import { TransactionList } from '@/common/TransactionList'
import AccountBalanceWalletIcon from '@/icons/AccountBalanceWalletIcon'
import { BellIcon } from '@/icons/BellIcon'
import ChevronDownIcon from '@/icons/ChevronDownIcon'
import ConnectWallet
  from '@/lib/connect-wallet/components/ConnectWallet/ConnectWallet'
import { useAuth } from '@/lib/connect-wallet/hooks/useAuth'
import { Routes } from '@/src/config/routes'
import { useNetwork } from '@/src/context/Network'
import { useNotifier } from '@/src/hooks/useNotifier'
import { LSHistory } from '@/src/services/transactions/history'
import {
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { truncateAddress } from '@/utils/address'
import { classNames } from '@/utils/classnames'
import { Menu } from '@headlessui/react'
import {
  t,
  Trans
} from '@lingui/macro'
import {
  Content,
  Overlay,
  Portal,
  Root
} from '@radix-ui/react-dialog'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useWeb3React } from '@web3-react/core'

export const Header = () => {
  const router = useRouter()

  const { notifier } = useNotifier()
  const { networkId } = useNetwork()
  const { active, account } = useWeb3React()
  const { logout } = useAuth(networkId, notifier)
  const [isAccountDetailsOpen, setIsAccountDetailsOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const [isTxDetailsPopupOpen, setIsTxDetailsPopupOpen] = useState(false)
  const [container, setContainer] = useState(null)

  const [unread, setUnread] = useState(0)

  useEffect(() => {
    TransactionHistory.on(() => {
      setUnread(() => {
        return LSHistory.getUnreadCount()
      })
    })
  }, [])

  useEffect(() => {
    if (!account) {
      setUnread(0)

      return
    }

    setUnread(() => {
      return LSHistory.getUnreadCount()
    })
  }, [account])

  const toggleMenu = () => {
    setIsOpen((prev) => { return !prev })
  }

  function onClose () {
    setIsOpen(false)
  }

  const navigation = useMemo(
    () => { return getNavigationLinks(router.pathname) },
    [router.pathname]
  )

  const handleToggleAccountPopup = () => {
    setIsAccountDetailsOpen((prev) => { return !prev })
  }

  const handleDisconnect = () => {
    if (active) {
      logout()
    }
    setIsAccountDetailsOpen(false)
  }

  const TransactionOverviewTooltip = ({ children, hide }) => {
    return (
      // @ts-ignore
      <Tooltip.Root delayDuration={200}>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Content
          className={classNames(
            'w-56 px-4 py-5 text-white bg-black z-60 rounded-1 shadow-tx-overview',
            hide ? 'hidden' : 'hidden xl:flex'
          )}
          side='bottom'
          sideOffset={7}
          alignOffset={15}
        >
          <Tooltip.Arrow className='' offset={8} fill='#01052D' height={7} />
          <span className='text-xs font-light leading-4'>
            Your transaction statuses will be collected in this tray. Feel free to
            navigate through the screens while you wait.
          </span>
        </Tooltip.Content>
      </Tooltip.Root>
    )
  }

  return (
    <>
      <div className='bg-black text-EEEEEE'>
        <Banner />
        <NavContainer>
          <div className='justify-end hidden max-w-full py-0 mx-auto sm:pl-6 xl:pl-20 xl:pr-18 xl:flex'>
            <LanguageDropdown />
          </div>
        </NavContainer>
      </div>

      <header className='sticky z-40 bg-black -top-px text-EEEEEE'>
        <NavContainer>
          <nav className='flex justify-between max-w-full mx-auto' aria-label='Top'>
            <div className='flex items-center justify-between py-0 xl:basis-full h-14 lg:h-20 xl:border-b border-B0C4DB xl:border-none'>
              <Link
                href={Routes.Home}
                locale={router.locale || router.defaultLocale}
              >
                <a className='sm:w-48'>
                  <HeaderLogo />
                </a>
              </Link>
            </div>

            <div className='self-stretch hidden gap-x-4 xl:flex'>
              {navigation.map((link) => {
                if (link.href) {
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      locale={router.locale}
                    >
                      <a
                        className={classNames(
                          'relative text-sm border-b-4 px-2 border-t-transparent inline-flex items-center whitespace-nowrap outline-none',
                          link.active
                            ? 'border-primary text-primary font-semibold'
                            : 'border-transparent text-white',
                          !link.active && 'before:w-full before:h-1 before:-bottom-1 before:left-0 before:absolute before:bg-primary before:scale-x-0 before:focus-visible:scale-x-100 before:transition-all before:hover:scale-x-100'
                        )}
                      >
                        {link.name}
                      </a>
                    </Link>
                  )
                }

                return (
                  <DropdownLinks key={link.name} name={link.name} isActive={link.active} items={link.items} />
                )
              })}
            </div>

            <div className='flex xl:basis-full xl:justify-end'>
              <div className='items-center hidden pt-3 pb-3 xl:flex'>
                <ConnectWallet networkId={networkId} notifier={notifier}>
                  {({ onOpen }) => {
                    let button = (
                      <button
                        className='inline-block px-4 py-0 text-sm font-semibold leading-loose tracking-wider text-white uppercase border border-transparent rounded-md whitespace-nowrap hover:bg-opacity-75 bg-primary'
                        onClick={onOpen}
                        title={t`Connect wallet`}
                      >
                        <span className='sr-only'>{t`Connect wallet`}</span>
                        <Trans>Connect wallet</Trans>
                      </button>
                    )
                    if (active) {
                      button = (
                        <button
                          className='relative flex items-center px-4 py-0 text-sm font-semibold leading-loose tracking-wider text-white uppercase border border-transparent rounded-md hover:bg-opacity-75 bg-primary'
                          onClick={handleToggleAccountPopup}
                          title={t`account details`}
                        >
                          <span className='sr-only'>{t`account details`}</span>
                          <AccountBalanceWalletIcon width='24' height='24' />
                          <span className='pl-2'>{truncateAddress(account)}</span>
                        </button>
                      )
                    }

                    return (
                      <div>
                        <div className='flex items-stretch h-full space-x-4'>
                          <Network />
                          {button}
                          {isAccountDetailsOpen && (
                            <AccountDetailsModal
                              {...{
                                networkId,
                                account,
                                isOpen: isAccountDetailsOpen,
                                onClose: handleToggleAccountPopup,
                                active,
                                handleDisconnect
                              }}
                            />
                          )}
                        </div>
                      </div>
                    )
                  }}
                </ConnectWallet>
              </div>

              <div className='relative flex ml-3' ref={setContainer}>
                <TransactionOverviewTooltip hide={isTxDetailsPopupOpen}>
                  <button
                    aria-label='Transactions'
                    className={classNames(
                      'items-center justify-center px-4 flex relative self-stretch flex-shrink-0',
                      'before:absolute before:h-7 before:right-0 xl:before:left-0 before:bg-999BAB',
                      isTxDetailsPopupOpen
                        ? 'bg-404A5C before:w-0'
                        : 'bg-transparent before:w-px'
                    )}
                    onClick={() => { return setIsTxDetailsPopupOpen((val) => { return !val }) }}
                    data-testid='transaction-modal-button'
                  >
                    <span className='sr-only'>{t`transaction overview button`}</span>
                    <IconWithBadge number={unread}>
                      <BellIcon className='text-white' />
                    </IconWithBadge>
                  </button>
                </TransactionOverviewTooltip>
              </div>

              {!isOpen && (
                <div className='flex items-center xl:hidden'>
                  <BurgerMenu
                    isOpen={isOpen}
                    onToggle={toggleMenu}
                    className='h-full px-4'
                  />
                </div>
              )}
            </div>

            <TransactionList
              isOpen={isTxDetailsPopupOpen}
              onClose={setIsTxDetailsPopupOpen}
              container={container}
            />
          </nav>
        </NavContainer>
        <MenuModal
          isOpen={isOpen}
          onClose={onClose}
          navigation={getFlattenedNavLinks()}
          network={<Network closeMenu={onClose} />}
          networkId={networkId}
          notifier={notifier}
          active={active}
          account={account}
          handleToggleAccountPopup={handleToggleAccountPopup}
          isAccountDetailsOpen={isAccountDetailsOpen}
          handleDisconnect={handleDisconnect}
        />
      </header>
    </>
  )
}

export const MenuModal = ({
  isOpen,
  onClose,
  navigation,
  network,
  networkId,
  notifier,
  active,
  account,
  handleToggleAccountPopup,
  isAccountDetailsOpen,
  handleDisconnect
}) => {
  const router = useRouter()

  useEffect(() => {
    const handleRouteNavigate = () => {
      onClose()
    }

    router.events.on('routeChangeComplete', handleRouteNavigate)

    return () => {
      router.events.off('routeChangeComplete', handleRouteNavigate)
    }
  }, [onClose, router.events])

  return (
    <div>
      <Root open={isOpen} onOpenChange={onClose}>
        <Portal>
          <Overlay className='fixed inset-0 z-40 overflow-y-auto bg-black bg-opacity-80 backdrop-blur-md' />

          <Content className='fixed inset-0 z-50 w-full max-h-screen px-4 overflow-y-auto'>
            <div className='flex flex-col items-end justify-between min-h-screen px-4 py-24 pt-6 text-center'>
              <div className='absolute right-6 top-6'>
                <BurgerMenu isOpen onToggle={onClose} />
              </div>
              <div className='w-full sm:px-16'>
                <LanguageDropdown onOverlay />
              </div>
              <div className='flex flex-col flex-grow w-full text-left align-middle transition-all transform shadow-xl sm:px-16 sm:align-baseline rounded-2xl'>
                <div className='flex flex-col justify-start mb-auto overflow-y-auto'>
                  {navigation.map((link) => {
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        locale={router.locale}
                      >
                        <a
                          className={classNames(
                            'text-display-sm leading-6 pt-8 sm:pt-12 pb-3 sm:pb-4 mb-5 sm:mb-8 border-b-4 w-fit',
                            router.pathname === link.href
                              ? 'border-4E7DD9 text-4E7DD9 font-semibold'
                              : 'border-transparent text-white'
                          )}
                        >
                          {link.mobileName || link.name}
                        </a>
                      </Link>
                    )
                  })}
                </div>
                <div className='py-5 mb-12'>
                  <ConnectWallet networkId={networkId} notifier={notifier}>
                    {({ onOpen }) => {
                      let button = (
                        <button
                          className='justify-center inline-block w-full px-4 py-4 mt-6 text-sm font-semibold leading-none tracking-wider text-white uppercase border border-transparent rounded-md md:py-3 lg:py-4 xl:py-2 hover:bg-opacity-75 bg-primary'
                          onClick={onOpen}
                          title={t`Connect wallet`}
                        >
                          <span className='sr-only'>{t`Connect wallet`}</span>
                          Connect wallet
                        </button>
                      )
                      if (active) {
                        button = (
                          <button
                            aria-label='Account Details'
                            className='relative flex items-center justify-center w-full px-4 py-2 mt-6 text-sm font-semibold leading-loose tracking-wider text-white uppercase border border-transparent rounded-md md:py-3 lg:py-4 xl:py-2 hover:bg-opacity-75 bg-primary'
                            onClick={handleToggleAccountPopup}
                            title={t`account details`}
                          >
                            <span className='sr-only'>
                              {t`account details`}
                            </span>
                            <AccountBalanceWalletIcon width='24' height='24' />
                            <span className='pl-2'>
                              {truncateAddress(account)}
                            </span>
                          </button>
                        )
                      }

                      return (
                        <div className='flex flex-col justify-between w-full'>
                          {network} {button}
                          {isAccountDetailsOpen && (
                            <AccountDetailsModal
                              {...{
                                networkId,
                                account,
                                isOpen: isAccountDetailsOpen,
                                onClose: handleToggleAccountPopup,
                                active,
                                handleDisconnect
                              }}
                            />
                          )}
                        </div>
                      )
                    }}
                  </ConnectWallet>
                </div>
              </div>
            </div>
          </Content>
        </Portal>
      </Root>
    </div>
  )
}

const DropdownLinks = ({ name, isActive, items = [] }) => {
  return (
    <Menu as='div' className='relative'>
      {
        ({ open }) => {
          return (
            <>
              <Menu.Button
                className={classNames(
                  'relative h-full text-sm border-b-4 px-2 border-t-transparent inline-flex gap-2 items-center whitespace-nowrap outline-none',
                  isActive
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-white',
                  (!isActive) && 'before:w-full before:h-1 before:-bottom-1 before:left-0 before:absolute before:bg-primary before:scale-x-0 before:focus-visible:scale-x-100 before:transition-all before:hover:scale-x-100',
                  !isActive && open && 'before:scale-x-100'
                )}
              >
                {name}
                <ChevronDownIcon
                  width='20' height='20'
                  className={classNames('flex-shrink-0 transform', open && 'rotate-180')}
                />
              </Menu.Button>

              <Menu.Items
                className='absolute z-10 w-auto py-4 space-y-6 overflow-y-auto text-white bg-black shadow-lg outline-none -left-1/3 min-w-205'
              >
                {
                items.map((item, idx) => {
                  return (
                    <Menu.Item key={idx}>
                      {
                      ({ active }) => {
                        return (
                          <a
                            href={item.href}
                            className={classNames(
                              'gap-2 text-sm inline-flex items-center whitespace-nowrap p-1 pl-10 w-full',
                              item.active && 'text-primary font-semibold',
                              active && 'text-primary'
                            )}
                          >
                            {
                              item.imgSrc && (
                                <div className='flex w-6 h-6 overflow-hidden bg-white rounded-full place-items-center'>
                                  <img src={item.imgSrc} className='w-6 h-6' alt={`${item.name} logo`} />
                                </div>
                              )
                            }
                            {item.name}
                          </a>
                        )
                      }
                    }
                    </Menu.Item>
                  )
                })
              }
              </Menu.Items>
            </>
          )
        }
      }
    </Menu>
  )
}
