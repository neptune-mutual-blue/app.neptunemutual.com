import { classNames } from "@/utils/classnames";
import Link from "next/link";
import { useRouter } from "next/router";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Pool", href: "/pools" },
  { name: "My Policies", href: "/my-policies" },
  { name: "My Liquidity", href: "/my-liquidity" },
  { name: "Reporting", href: "/reporting" },
];

export const Header = () => {
  const router = useRouter();

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
                        router.pathname == link.href
                          ? "border-4E7DD9 text-4E7DD9 font-semibold"
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
          <div className="ml-10 space-x-4 py-5 flex border-l border-728FB2 sm:pl-6 lg:pl-8">
            <div className="inline-flex items-center bg-FEFEFF text-9B9B9B text-sm leading-loose py-2 px-4 border border-transparent rounded-md font-medium">
              <img
                src="/networks/ethereum.png"
                alt="Ethereum"
                height="5px"
                className="inline-block mr-2"
                style={{ fontSize: "0" }}
              />
              <span className="inline-block">Ethereum</span>
            </div>
            <a
              href="#"
              className="inline-block bg-4E7DD9 text-sm leading-loose py-2 px-4 border border-transparent rounded-md font-medium text-white hover:bg-opacity-75"
            >
              Connect Wallet
            </a>
          </div>
        </div>
        <div className="flex flex-wrap justify-center space-x-6 lg:hidden">
          {navigation.map((link) => {
            return (
              <Link key={link.name} href={link.href}>
                <a
                  className={classNames(
                    "text-sm py-4 border-b-4",
                    router.pathname == link.href
                      ? "border-4E7DD9 text-4E7DD9 font-semibold"
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
