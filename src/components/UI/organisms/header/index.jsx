import { useAppContext } from "@/components/UI/organisms/AppWrapper";
import ConnectWallet from "@/lib/connect-wallet/components/ConnectWallet/ConnectWallet";
import { ChainLogos, NetworkNames } from "@/lib/connect-wallet/config/chains";
import { useNotifier } from "@/src/hooks/useNotifier";
import { classNames } from "@/utils/classnames";
import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
import { useRouter } from "next/router";

const navigation = [
  { name: "Home", href: "/" },
  /* { name: "Pool", href: "/pools/bond" }, */
  { name: "Pool", href: "/pools/" },
  { name: "My Policies", href: "/my-policies/" },
  { name: "My Liquidity", href: "/my-liquidity" },
  { name: "Reporting", href: "/reporting/" },
];

export const Header = () => {
  const router = useRouter();
  const { notifier } = useNotifier();
  const { networkId } = useAppContext();
  const { active } = useWeb3React();

  const ChainLogo = ChainLogos[networkId] || ChainLogos[1];

  const network = (
    <div className="inline-flex items-center bg-white text-9B9B9B text-sm leading-loose py-2 px-4 border border-transparent rounded-md font-medium">
      <ChainLogo width={24} height={24} />{" "}
      <p className="inline-block ml-2">
        {NetworkNames[networkId] || "Network"}
      </p>
    </div>
  );

  console.log(router.pathname);
  return (
    <header className="bg-black text-EEEEEE">
      <nav className="max-w-full mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full flex items-center justify-between border-b border-B0C4DB lg:border-none">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-h3 uppercase">Neptune Mutual</a>
            </Link>
            <div className="hidden ml-16 space-x-8 lg:block">
              {navigation.map((link) => {
                return (
                  <Link key={link.name} href={link.href}>
                    <a
                      className={classNames(
                        "text-sm py-7 border-b-4",
                        link.name !== "Home" &&
                          router.pathname.slice(1).includes(link.href.slice(1))
                          ? "border-4E7DD9 text-4E7DD9 font-semibold"
                          : "border-transparent text-999BAB",
                        link.name == "Home" &&
                          (router.pathname == link.href ||
                            router.pathname.includes("cover")) &&
                          "!border-4E7DD9 !text-4E7DD9 font-semibold"
                      )}
                    >
                      {link.name}
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>

          <ConnectWallet networkId={networkId} notifier={notifier}>
            {({ onOpen, logout }) => {
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
                    className="inline-block bg-4e7dd9 text-sm leading-loose py-2 px-4 border border-transparent rounded-md font-medium text-white hover:bg-opacity-75"
                    onClick={logout}
                  >
                    Disconnect
                  </button>
                );
              }

              return (
                <div className="ml-10 space-x-4 py-5 flex border-l border-728FB2 sm:pl-6 lg:pl-8">
                  {network} {button}
                </div>
              );
            }}
          </ConnectWallet>
        </div>
        <div className="flex flex-wrap justify-center space-x-6 lg:hidden">
          {navigation.map((link) => {
            return (
              <Link key={link.name} href={link.href}>
                <a
                  className={classNames(
                    "text-sm py-4 border-b-4",
                    router.pathname == link.href
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
      </nav>
    </header>
  );
};
