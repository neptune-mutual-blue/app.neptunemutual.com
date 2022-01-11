import ConnectWallet from "@/components/UI/organisms/header/ConnectWallet/ConnectWallet";
import { classNames } from "@/utils/classnames";
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
                    {/* <a
                      className={classNames(
                        "text-sm py-7 border-b-4",
                        router.pathname.startsWith(link.href)
                          ? "border-4E7DD9 text-4E7DD9 font-semibold"
                          : "border-transparent text-999BAB"
                      )}
                    > */}
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

          <ConnectWallet />
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
