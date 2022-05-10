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
    <div className="inline-flex items-center justify-center w-6/12 px-4 py-2 mr-2 overflow-hidden text-sm font-medium leading-loose bg-white border border-transparent rounded-md md:py-3 lg:py-4 xl:py-2 md:mr-4 xl:w-auto xl:mr-0 text-9B9B9B">
      <ChainLogo width={24} height={24} />{" "}
      <p className="inline-block ml-2 overflow-hidden whitespace-nowrap text-ellipsis">
        {NetworkNames[networkId] || "Network"}
      </p>
    </div>
  );

  return (
    <header className="inline bg-black text-EEEEEE">
      <Banner />
      <nav
        className="sticky top-0 z-40 max-w-full px-4 py-4 mx-auto bg-black sm:px-6 xl:px-8 xl:py-0 text-EEEEEE"
        aria-label="Top"
      >
        <div className="flex items-center justify-between w-full xl:border-b border-B0C4DB xl:border-none">
          <div className="flex items-center">
            <Link href="/" locale={router.locale || router.defaultLocale}>
              <a>
                <HeaderLogo />
              </a>
            </Link>
            <div className="hidden ml-16 space-x-8 xl:block">
              {navigation.map((link) => {
                return (
                  <Link key={link.name} href={link.href} locale={router.locale}>
                    <a
                      className={classNames(
                        "text-sm py-9 border-b-4",
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
            <div className="flex xl:hidden">
              <BurgerMenu isOpen={isOpen} onToggle={toggleMenu} />
            </div>
          )}
          <div className="items-center hidden xl:flex">
            <ConnectWallet networkId={networkId} notifier={notifier}>
              {({ onOpen }) => {
                let button = (
                  <button
                    className="inline-block px-4 py-2 text-sm font-medium leading-loose text-white border border-transparent rounded-md bg-4e7dd9 hover:bg-opacity-75"
                    onClick={onOpen}
                  >
                    Connect Wallet
                  </button>
                );
                if (active) {
                  button = (
                    <button
                      className="relative flex items-center px-4 py-2 text-sm font-medium leading-loose text-white border border-transparent rounded-md bg-4e7dd9 hover:bg-opacity-75"
                      onClick={handleToggleAccountPopup}
                    >
                      <AccountBalanceWalletIcon width="24" height="24" />
                      <span className="pl-2">{truncateAddress(account)}</span>
                    </button>
                  );
                }
                return (
                  <div className="pb-5 ml-10 sm:pl-6 xl:pl-8">
                    <div className="flex justify-end">
                      <LanguageDropdown />
                    </div>
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

          <Content className="fixed z-50 max-h-screen min-w-full px-4 overflow-y-auto transform -translate-x-1/2 -translate-y-48 top-48 lg:top-1/4 lg:-translate-y-1/4 left-1/2">
            <div className="flex flex-col items-end justify-between min-h-screen px-4 text-center">
              <div className="flex justify-end w-full max-w-full pt-6 mx-auto mb-7 sm:mb-14 xl:px-8 xl:py-0">
                <BurgerMenu isOpen={isOpen} onToggle={onClose} />
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
