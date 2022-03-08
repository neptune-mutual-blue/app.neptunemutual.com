import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAppContext } from "@/src/context/AppWrapper";
import ConnectWallet from "@/lib/connect-wallet/components/ConnectWallet/ConnectWallet";
import { ChainLogos, NetworkNames } from "@/lib/connect-wallet/config/chains";
import { useNotifier } from "@/src/hooks/useNotifier";
import { classNames } from "@/utils/classnames";
import { useWeb3React } from "@web3-react/core";
import AccountBalanceWalletIcon from "@/icons/AccountBalanceWalletIcon";
import { AccountDetailsModal } from "@/components/UI/organisms/header/AccountDetailsModal";
import useAuth from "@/lib/connect-wallet/hooks/useAuth";
import { Banner } from "@/components/common/Banner";
import { truncateAddress } from "@/utils/address";
import { HeaderLogo } from "@/components/UI/atoms/HeaderLogo";
import { BurgerComponent } from "@/components/UI/atoms/burgerMenu";
import * as Dialog from "@radix-ui/react-dialog";

const getNavigationLinks = (pathname = "") => {
  let links = [
    { name: "Pool", href: "/pools/bond", activeWhenStartsWith: "/pools" },
    !process.env.NEXT_PUBLIC_DISABLE_PURCHASE && {
      name: "My Policies",
      href: "/my-policies/active",
      activeWhenStartsWith: "/my-policies",
    },
    !process.env.NEXT_PUBLIC_DISABLE_ADD_LIQUIDITY && {
      name: "My Liquidity",
      href: "/my-liquidity",
      activeWhenStartsWith: "/my-liquidity",
    },
    !process.env.NEXT_PUBLIC_DISABLE_REPORTING && {
      name: "Reporting",
      href: "/reporting/active",
      activeWhenStartsWith: "/reporting",
    },
  ];

  links = links.filter(Boolean);

  links = links.map((link) => ({
    ...link,
    active: pathname.startsWith(link.activeWhenStartsWith),
  }));

  links.unshift({ name: "Home", href: "/", active: pathname === "/" });

  return links;
};

export const Header = () => {
  const router = useRouter();
  const { notifier } = useNotifier();
  const { networkId } = useAppContext();
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
    <div className="inline-flex items-center bg-white text-9B9B9B text-sm leading-loose py-2 px-4 border border-transparent rounded-md font-medium overflow-hidden">
      <ChainLogo width={24} height={24} />{" "}
      <p className="inline-block ml-2 whitespace-nowrap overflow-hidden text-ellipsis">
        {NetworkNames[networkId] || "Network"}
      </p>
    </div>
  );

  return (
    <header className="bg-black text-EEEEEE">
      <Banner />
      <nav
        className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-0"
        aria-label="Top"
      >
        <div className="w-full flex items-center justify-between lg:border-b border-B0C4DB lg:border-none">
          <div className="flex items-center">
            <Link href="/">
              <a>
                <HeaderLogo />
              </a>
            </Link>
            <div className="ml-16 space-x-8 hidden lg:block">
              {navigation.map((link) => {
                return (
                  <Link key={link.name} href={link.href}>
                    <a
                      className={classNames(
                        "text-sm py-7 border-b-4",
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
            <div className="flex lg:hidden">
              <BurgerComponent isOpen={isOpen} onToggle={toggleMenu} />
            </div>
          )}
          <div className="hidden lg:flex">
            <ConnectWallet networkId={networkId} notifier={notifier}>
              {({ onOpen }) => {
                let button = (
                  <button
                    className="inline-block bg-4e7dd9 text-sm leading-loose py-2 px-4 border border-transparent rounded-md font-medium text-white hover:bg-opacity-75"
                    onClick={onOpen}
                  >
                    Connect Wallet
                  </button>
                );
                if (active) {
                  button = (
                    <button
                      className="relative flex items-center bg-4e7dd9 text-sm leading-loose py-2 px-4 border border-transparent rounded-md font-medium text-white hover:bg-opacity-75"
                      onClick={handleToggleAccountPopup}
                    >
                      <AccountBalanceWalletIcon width="24" height="24" />
                      <span className="pl-2">{truncateAddress(account)}</span>
                    </button>
                  );
                }
                return (
                  <div className="ml-10 space-x-4 py-5 flex border-l border-728FB2 sm:pl-6 lg:pl-8">
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

  return (
    <div>
      <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <Dialog.Portal>
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 overflow-y-auto bg-black bg-opacity-80 backdrop-blur-xl" />

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto max-h-screen">
              <div className="max-w-full mx-auto lg:px-8 py-4 lg:py-0 flex justify-end">
                <BurgerComponent isOpen={isOpen} onToggle={onClose} />
              </div>
              <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle sm:align-baseline transition-all transform shadow-xl rounded-2xl">
                <div className="flex flex-col max-h-[70vh] overflow-y-auto justify-start">
                  {navigation.map((link) => {
                    return (
                      <Link key={link.name} href={link.href}>
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
                <div className="mt-12">
                  <ConnectWallet networkId={networkId} notifier={notifier}>
                    {({ onOpen }) => {
                      let button = (
                        <button
                          className="inline-block bg-4e7dd9 text-sm leading-loose py-2 px-4 border border-transparent rounded-md font-medium text-white hover:bg-opacity-75"
                          onClick={onOpen}
                        >
                          Connect Wallet
                        </button>
                      );
                      if (active) {
                        button = (
                          <button
                            className="relative flex items-center bg-4e7dd9 text-sm leading-loose py-2 px-4 border border-transparent rounded-md font-medium text-white hover:bg-opacity-75"
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
                        <div className="py-5 flex justify-between sm:pl-6 lg:pl-8">
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
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
