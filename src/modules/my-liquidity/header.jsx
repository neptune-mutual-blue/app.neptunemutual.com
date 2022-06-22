import { BreadCrumbs } from "@/common/BreadCrumbs/BreadCrumbs";
import { Container } from "@/common/Container/Container";
import { Hero } from "@/common/Hero";
import { HeroStat } from "@/common/HeroStat";
import { HeroTitle } from "@/common/HeroTitle";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  // const { data } = useMyLiquidities();
  // const { liquidityList } = data;
  // const totalLiquidityProvided = useCalculateTotalLiquidity({ liquidityList });
  // const { liquidityTokenDecimals } = useAppConstants();

  return (
    <Hero>
      <Container className="flex flex-col flex-wrap px-2 pt-9 pb-28">
        <BreadCrumbs
          pages={[
            { name: t`Home`, href: "/", current: false },
            {
              name: "Popular DeFi Apps",
              href: `/covers/defi/options`,
              current: false,
            },
            { name: t`Purchase Liquidity`, current: true },
          ]}
        />
        <div className="flex pt-7">
          <div className="flex flex-col">
            <HeroTitle>
              <Trans>Provide Liquidity</Trans>
            </HeroTitle>
            <span className="font-bold text-md">
              <Trans>Popular DeFi Apps</Trans>
            </span>
          </div>
          <HeroStat title={t`My Liquidity`}>
            {/* {
              formatCurrency(
                convertFromUnits(
                  totalLiquidityProvided,
                  liquidityTokenDecimals
                ),
                router.locale,
                "USD",
                true
              ).long
            } */}
            $ 51,560.00 DAI
          </HeroStat>
        </div>
      </Container>
      <hr className="border-b border-B0C4DB" />
    </Hero>
  );
}
