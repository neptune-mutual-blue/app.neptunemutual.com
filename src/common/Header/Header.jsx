import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useNetwork } from "@/src/context/Network";
import ConnectWallet from "@/lib/connect-wallet/components/ConnectWallet/ConnectWallet";
import { ChainLogos, NetworkNames } from "@/lib/connect-wallet/config/chains";
import { useNotifier } from "@/src/hooks/useNotifier";
import { classNames } from "@/utils/classnames";
import { useWeb3React } from "@web3-react/core";
import AccountBalanceWalletIcon from "@/icons/AccountBalanceWalletIcon";
import { AccountDetailsModal } from "@/common/Header/AccountDetailsModal";
import useAuth from "@/lib/connect-wallet/hooks/useAuth";
import { Banner } from "@/common/Banner";
import { truncateAddress } from "@/utils/address";
import { HeaderLogo } from "@/common/HeaderLogo";
import { BurgerMenu } from "@/common/BurgerMenu/BurgerMenu";
import { Root, Overlay, Content, Portal } from "@radix-ui/react-dialog";
import { isFeatureEnabled } from "@/src/config/environment";
import { t } from "@lingui/macro";
import { LanguageDropdown } from "@/common/Header/LanguageDropdown";
import { TransactionOverviewIcon } from "@/icons/TransactionOverviewIcon";
import * as Tooltip from "@radix-ui/react-tooltip";
import { TransactionList } from "@/common/TransactionList";

const getNavigationLinks = (pathname = "") => {
  const policyEnabled = isFeatureEnabled("policy");
  const liquidityEnabled = isFeatureEnabled("liquidity");
  const reportingEnabled = isFeatureEnabled("reporting");

  let poolLink = null;
  if (isFeatureEnabled("bond")) {
    poolLink = "/pools/bond";
  } else if (isFeatureEnabled("staking-pool")) {
    poolLink = "/pools/staking";
  } else if (isFeatureEnabled("pod-staking-pool")) {
    poolLink = "/pools/pod-staking";
  }

  let links = [
    poolLink && {
      name: t`Pool`,
      href: poolLink,
      activeWhenStartsWith: "/pools",
    },
    policyEnabled && {
      name: t`My Policies`,
      href: "/my-policies/active",
      activeWhenStartsWith: "/my-policies",
    },
    liquidityEnabled && {
      name: t`My Liquidity`,
      href: "/my-liquidity",
      activeWhenStartsWith: "/my-liquidity",
    },
    reportingEnabled && {
      name: t`Reporting`,
      href: "/reporting/active",
      activeWhenStartsWith: "/reporting",
    },
  ];

  links = links.filter(Boolean);

  links = links.map((link) => ({
    ...link,
    active: pathname.startsWith(link.activeWhenStartsWith),
  }));

  links.unshift({ name: t`Home`, href: "/", active: pathname === "/" });

  return links;
};

export const Header = () => {
  const router = useRouter();

  const { notifier } = useNotifier();
  const { networkId } = useNetwork();
  const { active, account } = useWeb3React();
  const { logout } = useAuth(networkId, notifier);
  const [isAccountDetailsOpen, setIsAccountDetailsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [isTxDetailsPopupOpen, setIsTxDetailsPopupOpen] = useState(false);
  const [container, setContainer] = useState(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  function onClose() {
    setIsOpen(false);
  }

  const navigation = useMemo(
    () => getNavigationLinks(router.pathname),
    [router.pathname]
  );

  const handleToggleAccountPopup = () => {
    setIsAccountDetailsOpen((prev) => !prev);
  };

  const handleDisconnect = () => {
    if (active) {
      logout();
    }
    setIsAccountDetailsOpen(false);
  };

  const ChainLogo = ChainLogos[networkId] || ChainLogos[1];

  const network = (
    <div className="inline-flex items-center justify-center w-6/12 px-4 py-2 mr-2 overflow-hidden text-sm font-normal leading-loose md:py-3 lg:py-4 xl:py-2 md:mr-4 xl:w-auto xl:mr-0 text-FEFEFF">
      <ChainLogo width={24} height={24} />{" "}
      <p className="inline-block ml-2 overflow-hidden whitespace-nowrap text-ellipsis">
        {NetworkNames[networkId] || "Network"}
      </p>
    </div>
  );

  const TransactionOverviewTooltip = ({ children, hide }) => (
    <Tooltip.Root delayDuration={200}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Content
        className={classNames(
          "w-56 px-4 py-5 text-white bg-black z-60 rounded-1 shadow-tx-overview",
          hide ? "hidden" : "flex"
        )}
        side="bottom"
        sideOffset={7}
        alignOffset={15}
      >
        <Tooltip.Arrow className="" offset={8} fill="#01052D" height={7} />
        <span className="text-xs font-light leading-4 font-poppins">
          Your transaction statuses will be collected in this tray. Feel free to
          navigate through the screens while you wait.
        </span>
      </Tooltip.Content>
    </Tooltip.Root>
  );

  return (
    <>
      <div className="bg-black text-EEEEEE">
        <Banner />
        <div className="flex justify-end max-w-full py-0 pr-4 mx-auto sm:px-6 xl:px-20">
          <LanguageDropdown />
        </div>
      </div>
      <header className="sticky top-0 z-40 bg-black text-EEEEEE">
        <nav className="flex max-w-full mx-auto" aria-label="Top">
          <div className="h-14 lg:h-20 flex items-stretch justify-between flex-grow pl-4 sm:px-6 xl:pl-8 py-0 xl:pr-22px xl:border-b border-B0C4DB xl:border-none">
            <div className="flex items-center">
              <Link href="/" locale={router.locale || router.defaultLocale}>
                <a>
                  <HeaderLogo />
                </a>
              </Link>
              <div className="self-stretch hidden ml-16 space-x-8 xl:flex">
                {navigation.map((link) => {
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      locale={router.locale}
                    >
                      <a
                        className={classNames(
                          "text-sm border-b-4 border-t-transparent inline-flex items-center whitespace-nowrap",
                          link.active
                            ? "border-4e7dd9 text-4e7dd9 font-semibold"
                            : "border-transparent text-999BAB"
                        )}
                      >
                        {link.name}
                      </a>
                    </Link>
                  );
                })}
              </div>
            </div>

            {!isOpen && (
              <div className="flex items-center xl:hidden">
                <button
                  className={classNames(
                    "items-center justify-center px-4 flex relative self-stretch flex-shrink-0",
                    "before:absolute before:h-7 before:right-0 before:bg-999BAB",
                    isTxDetailsPopupOpen
                      ? "bg-404A5C before:w-0"
                      : "bg-transparent before:w-px"
                  )}
                  onClick={() => setIsTxDetailsPopupOpen((val) => !val)}
                >
                  <TransactionOverviewIcon
                    className={classNames(
                      isTxDetailsPopupOpen ? "text-white" : "text-999BAB"
                    )}
                  />
                </button>
                <BurgerMenu
                  isOpen={isOpen}
                  onToggle={toggleMenu}
                  className="px-4 h-full"
                />
              </div>
            )}

            <div className="items-center hidden pt-3 pb-3 xl:flex">
              <ConnectWallet networkId={networkId} notifier={notifier}>
                {({ onOpen }) => {
                  let button = (
                    <button
                      className="inline-block px-4 py-0 text-sm font-medium leading-loose text-white border border-transparent rounded-md whitespace-nowrap bg-4e7dd9 hover:bg-opacity-75"
                      onClick={onOpen}
                    >
                      Connect Wallet
                    </button>
                  );
                  if (active) {
                    button = (
                      <button
                        className="relative flex items-center px-4 py-0 text-sm font-medium leading-loose text-white border border-transparent rounded-md bg-4e7dd9 hover:bg-opacity-75"
                        onClick={handleToggleAccountPopup}
                      >
                        <AccountBalanceWalletIcon width="24" height="24" />
                        <span className="pl-2">{truncateAddress(account)}</span>
                      </button>
                    );
                  }
                  return (
                    <div className="ml-10 sm:pl-6 xl:pl-8">
                      <div className="flex space-x-4">
                        {network} {button}
                        {isAccountDetailsOpen && (
                          <AccountDetailsModal
                            {...{
                              networkId,
                              account,
                              isOpen: isAccountDetailsOpen,
                              onClose: handleToggleAccountPopup,
                              active,
                              handleDisconnect,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                }}
              </ConnectWallet>
            </div>
          </div>
          <div className="relative flex" ref={setContainer}>
            <TransactionOverviewTooltip hide={isTxDetailsPopupOpen}>
              <button
                className={classNames(
                  "items-center justify-center hidden px-5 xl:flex relative self-stretch flex-shrink-0",
                  "before:absolute before:h-7 before:left-0 before:bg-999BAB",
                  isTxDetailsPopupOpen
                    ? "bg-404A5C before:w-0"
                    : "bg-transparent before:w-px"
                )}
                onClick={() => setIsTxDetailsPopupOpen((val) => !val)}
              >
                <TransactionOverviewIcon
                  className={classNames(
                    isTxDetailsPopupOpen ? "text-white" : "text-999BAB"
                  )}
                />
              </button>
            </TransactionOverviewTooltip>
          </div>
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
          network={network}
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
  );
};

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
  handleDisconnect,
}) => {
  const router = useRouter();

  const handleRouteNavigate = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    router.events.on("routeChangeComplete", handleRouteNavigate);

    return () => {
      router.events.off("routeChangeComplete", handleRouteNavigate);
    };
  }, [handleRouteNavigate, router.events]);

  return (
    <div>
      <Root open={isOpen} onOpenChange={onClose}>
        <Portal>
          <Overlay className="fixed inset-0 z-40 overflow-y-auto bg-black bg-opacity-80 backdrop-blur-xl" />

          <Content className="fixed z-50 w-full max-h-screen px-4 overflow-y-auto transform -translate-x-1/2 -translate-y-48 top-48 lg:top-1/4 lg:-translate-y-1/4 left-1/2">
            <div className="flex flex-col items-end justify-between min-h-screen px-4 text-center">
              <div className="flex justify-end w-full max-w-full pt-6 mx-auto mb-7 sm:mb-14 xl:px-8 xl:py-0">
                <BurgerMenu isOpen onToggle={onClose} />
              </div>
              <div className="w-full sm:px-16">
                <LanguageDropdown />
              </div>
              <div className="flex flex-col flex-grow w-full text-left align-middle transition-all transform shadow-xl sm:px-16 sm:align-baseline rounded-2xl">
                <div className="flex flex-col justify-start overflow-y-auto mb-28">
                  {navigation.map((link) => {
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        locale={router.locale}
                      >
                        <a
                          className={classNames(
                            "text-h2 leading-6 sm:text-xxl pt-8 sm:pt-12 pb-3 sm:pb-4 mb-5 sm:mb-8 border-b-4 w-fit",
                            router.pathname == link.href
                              ? "border-4e7dd9 text-4e7dd9 font-semibold"
                              : "border-transparent text-white"
                          )}
                        >
                          {link.name}
                        </a>
                      </Link>
                    );
                  })}
                </div>
                <div className="py-5 mb-12">
                  <ConnectWallet networkId={networkId} notifier={notifier}>
                    {({ onOpen }) => {
                      let button = (
                        <button
                          className="justify-center inline-block w-6/12 px-4 py-2 ml-2 text-sm font-medium leading-none text-white border border-transparent rounded-md md:py-3 lg:py-4 xl:py-2 md:ml-4 bg-4e7dd9 hover:bg-opacity-75"
                          onClick={onOpen}
                        >
                          Connect Wallet
                        </button>
                      );
                      if (active) {
                        button = (
                          <button
                            className="relative flex items-center justify-center w-6/12 px-4 py-2 ml-2 text-sm font-medium leading-loose text-white border border-transparent rounded-md md:py-3 lg:py-4 xl:py-2 md:ml-4 bg-4e7dd9 hover:bg-opacity-75"
                            onClick={handleToggleAccountPopup}
                          >
                            <AccountBalanceWalletIcon width="24" height="24" />
                            <span className="pl-2">
                              {truncateAddress(account)}
                            </span>
                          </button>
                        );
                      }
                      return (
                        <div className="flex justify-between">
                          {network} {button}
                          {isAccountDetailsOpen && (
                            <AccountDetailsModal
                              {...{
                                networkId,
                                account,
                                isOpen: isAccountDetailsOpen,
                                onClose: handleToggleAccountPopup,
                                active,
                                handleDisconnect,
                              }}
                            />
                          )}
                        </div>
                      );
                    }}
                  </ConnectWallet>
                </div>
              </div>
            </div>
          </Content>
        </Portal>
      </Root>
    </div>
  );
};
