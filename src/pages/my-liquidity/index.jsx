import Head from "next/head";

import { Container } from "@/common/Container/Container";
import { Hero } from "@/common/Hero";
import { HeroTitle } from "@/common/HeroTitle";
import { HeroStat } from "@/common/HeroStat";
import { MyLiquidityPage } from "@/modules/my-liquidity";
import { formatCurrency } from "@/utils/formatter/currency";
import { ComingSoon } from "@/common/ComingSoon";
import { useWeb3React } from "@web3-react/core";
import { useMyLiquidities } from "@/src/hooks/useMyLiquidities";
import { convertFromUnits } from "@/utils/bn";
import { isFeatureEnabled } from "@/src/config/environment";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";
import { useAppConstants } from "@/src/context/AppConstants";
import { useCalculateTotalLiquidity } from "@/src/hooks/useCalculateTotalLiquidity";

export function getStaticProps() {
  return {
    props: {
      disabled: !isFeatureEnabled("liquidity"),
    },
  };
}

export default function MyLiquidity({ disabled }) {
  const { account } = useWeb3React();
  const { data, loading } = useMyLiquidities();
  const { liquidityList, myLiquidities } = data;
  const totalLiquidityProvided = useCalculateTotalLiquidity({ liquidityList });

  const router = useRouter();

  const { liquidityTokenDecimals } = useAppConstants();

  if (disabled) {
    return <ComingSoon />;
  }

  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>

      <Hero>
        <Container className="flex flex-wrap px-2 py-20">
          <HeroTitle>
            <Trans>My Liquidity</Trans>
          </HeroTitle>
          {account && (
            <HeroStat title={t`My Total Liquidity`}>
              {loading && t`loading...`}
              {!loading &&
                `$ ${
                  formatCurrency(
                    convertFromUnits(
                      totalLiquidityProvided,
                      liquidityTokenDecimals
                    ),
                    router.locale,
                    "USD",
                    true
                  ).long
                }
                `}
            </HeroStat>
          )}
        </Container>
        <hr className="border-b border-B0C4DB" />
      </Hero>

      <MyLiquidityPage myLiquidities={myLiquidities} loading={loading} />
    </main>
  );
}
