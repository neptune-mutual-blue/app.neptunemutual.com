import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { Banner } from '@/common/Banner'
import { BurgerMenu } from '@/common/BurgerMenu/BurgerMenu'
import { AccountDetailsModal } from '@/common/Header/AccountDetailsModal'
import { LanguageDropdown } from '@/common/Header/LanguageDropdown'
import { Network } from '@/common/Header/Network'
import { HeaderLogo } from '@/common/HeaderLogo'
import { IconWithBadge } from '@/common/IconWithBadge'
import { TransactionList } from '@/common/TransactionList'
import AccountBalanceWalletIcon from '@/icons/AccountBalanceWalletIcon'
import { BellIcon } from '@/icons/BellIcon'
import ConnectWallet
  from '@/lib/connect-wallet/components/ConnectWallet/ConnectWallet'
import useAuth from '@/lib/connect-wallet/hooks/useAuth'
import { isFeatureEnabled } from '@/src/config/environment'
import { Routes } from '@/src/config/routes'
import { useNetwork } from '@/src/context/Network'
import { useNotifier } from '@/src/hooks/useNotifier'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'
import {
  logCloseConnectionPopup,
  logOpenConnectionPopup,
  logWalletDisconnected
} from '@/src/services/logs'
import { LSHistory } from '@/src/services/transactions/history'
import {
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { truncateAddress } from '@/utils/address'
import { classNames } from '@/utils/classnames'
import { analyticsLogger } from '@/utils/logger'
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

const getNavigationLinks = (pathname = '') => {
  const policyEnabled = isFeatureEnabled('policy')
  const liquidityEnabled = isFeatureEnabled('liquidity')
  const reportingEnabled = isFeatureEnabled('reporting')

  const poolLink = Routes.Pools()

  /**
   * @typedef Link
   * @prop {string} name
   * @prop {string} href
   * @prop {string} [activeWhenStartsWith]
   * @prop {boolean} [active]
   */

  /** @type {Link[]} */
  let links = [
    poolLink && {
      name: t`Pool`,
      href: poolLink,
      activeWhenStartsWith: '/pools'
    },
    policyEnabled && {
      name: t`My Policies`,
      href: Routes.MyActivePolicies,
      activeWhenStartsWith: '/my-policies'
    },
    liquidityEnabled && {
      name: t`My Liquidity`,
      href: Routes.MyLiquidity,
      activeWhenStartsWith: '/my-liquidity'
    },
    reportingEnabled && {
      name: t`Reporting`,
      href: Routes.ActiveReports,
      activeWhenStartsWith: '/reports'
    }
  ]

  links = links.filter(Boolean)

  links = links.map((link) => ({
    ...link,
    active: pathname.startsWith(link.activeWhenStartsWith)
  }))

  links.unshift({ name: t`Home`, href: '/', active: pathname === '/' })

  return links
}

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

  const { isMainNet, isArbitrum } = useValidateNetwork(networkId)

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
    setIsOpen((prev) => !prev)
  }

  function onClose () {
    setIsOpen(false)
  }

  const navigation = useMemo(
    () => getNavigationLinks(router.pathname),
    [router.pathname]
  )

  const handleToggleAccountPopup = () => {
    setIsAccountDetailsOpen((prev) => !prev)
    if (!isAccountDetailsOpen) {
      analyticsLogger(() => logOpenConnectionPopup(networkId, account))
    } else {
      analyticsLogger(() => logCloseConnectionPopup(networkId, account))
    }
  }

  const handleDisconnect = () => {
    if (active) {
      logout()
      analyticsLogger(() => logWalletDisconnected(networkId, account))
    }
    setIsAccountDetailsOpen(false)
  }

  const TransactionOverviewTooltip = ({ children, hide }) => (
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

  const buttonBg = isArbitrum
    ? 'bg-1D9AEE'
    : isMainNet
      ? 'bg-4e7dd9'
      : 'bg-5D52DC'

  return (
    <>
      <div className='bg-black text-EEEEEE'>
        <Banner />
        <div className='justify-end max-w-full py-0 pr-4 mx-auto sm:px-6 xl:px-20 hidden xl:flex'>
          <LanguageDropdown />
        </div>
      </div>
      <header className='sticky z-40 bg-black -top-px text-EEEEEE'>
        <nav className='flex max-w-full mx-auto' aria-label='Top'>
          <div className='flex items-stretch justify-between flex-grow py-0 pl-4 h-14 lg:h-20 sm:px-6 xl:pl-8 xl:pr-22px xl:border-b border-B0C4DB xl:border-none'>
            <div className='flex items-center'>
              <Link
                href={Routes.Home}
                locale={router.locale || router.defaultLocale}
              >
                <a className='sm:w-48'>
                  <HeaderLogo />
                </a>
              </Link>
              <div className='self-stretch hidden ml-16 space-x-8 xl:flex'>
                {navigation.map((link) => {
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      locale={router.locale}
                    >
                      <a
                        className={classNames(
                          'text-sm border-b-4 border-t-transparent inline-flex items-center whitespace-nowrap',
                          link.active
                            ? 'border-4e7dd9 text-4e7dd9 font-semibold'
                            : 'border-transparent text-999BAB'
                        )}
                      >
                        {link.name}
                      </a>
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className='items-center hidden pt-3 pb-3 xl:flex'>
              <ConnectWallet networkId={networkId} notifier={notifier}>
                {({ onOpen }) => {
                  let button = (
                    <button
                      className={classNames(
                        'inline-block uppercase px-4 py-0 text-sm font-semibold tracking-wider leading-loose text-white border border-transparent rounded-md whitespace-nowrap hover:bg-opacity-75',
                        buttonBg
                      )}
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
                        className={classNames(
                          'relative flex items-center uppercase px-4 py-0 text-sm font-semibold leading-loose text-white border border-transparent rounded-md hover:bg-opacity-75 tracking-wider',
                          buttonBg
                        )}
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
                    <div className='ml-10 sm:pl-6 xl:pl-8'>
                      <div className='flex space-x-4'>
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
          </div>

          <div className='relative flex' ref={setContainer}>
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
                onClick={() => setIsTxDetailsPopupOpen((val) => !val)}
              >
                <span className='sr-only'>{t`transaction overview button`}</span>
                <IconWithBadge number={unread}>
                  <BellIcon
                    className={classNames(
                      isTxDetailsPopupOpen ? 'text-white' : 'text-999BAB'
                    )}
                  />
                </IconWithBadge>

              </button>
            </TransactionOverviewTooltip>
          </div>

          {!isOpen && (
            <div className='flex items-center xl:pr-6 xl:hidden'>
              <BurgerMenu
                isOpen={isOpen}
                onToggle={toggleMenu}
                className='h-full px-4'
              />
            </div>
          )}

          <TransactionList
            isOpen={isTxDetailsPopupOpen}
            onClose={setIsTxDetailsPopupOpen}
            container={container}
          />
        </nav>
        <MenuModal
          isOpen={isOpen}
          onClose={onClose}
          navigation={navigation}
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
  const { isMainNet, isArbitrum } = useValidateNetwork(networkId)

  const handleRouteNavigate = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteNavigate)

    return () => {
      router.events.off('routeChangeComplete', handleRouteNavigate)
    }
  }, [handleRouteNavigate, router.events])

  const buttonBg = isArbitrum
    ? 'bg-1D9AEE'
    : isMainNet
      ? 'bg-4e7dd9'
      : 'bg-5D52DC'

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
                            'text-h2 leading-6 pt-8 sm:pt-12 pb-3 sm:pb-4 mb-5 sm:mb-8 border-b-4 w-fit',
                            router.pathname === link.href
                              ? 'border-4e7dd9 text-4e7dd9 font-semibold'
                              : 'border-transparent text-white'
                          )}
                        >
                          {link.name}
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
                          className={classNames(
                            'justify-center inline-block w-full px-4 py-4 mt-6 text-sm font-semibold leading-none text-white border border-transparent rounded-md md:py-3 lg:py-4 xl:py-2 hover:bg-opacity-75 uppercase tracking-wider',
                            buttonBg
                          )}
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
                            className={classNames(
                              'relative flex items-center justify-center w-full px-4 py-2 mt-6 text-sm font-semibold uppercase tracking-wider leading-loose text-white border border-transparent rounded-md md:py-3 lg:py-4 xl:py-2 hover:bg-opacity-75', buttonBg
                            )}
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
