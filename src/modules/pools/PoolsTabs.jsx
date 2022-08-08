import { Container } from "@/common/Container/Container";
import { Hero } from "@/common/Hero";
import { HeroStat } from "@/common/HeroStat";
import { HeroTitle } from "@/common/HeroTitle";
import { TabNav } from "@/common/Tab/TabNav";
import { isFeatureEnabled } from "@/src/config/environment";
import { useAppConstants } from "@/src/context/AppConstants";
import { convertFromUnits } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { Trans } from "@lingui/macro";
import { useRouter } from "next/router";

const headers = [
  isFeatureEnabled("bond") && {
    name: "bond",
    href: "/pools/bond",
    displayAs: <Trans>Bond</Trans>,
  },
  isFeatureEnabled("staking-pool") && {
    name: "staking",
    href: "/pools/staking",
    displayAs: <Trans>Staking</Trans>,
  },
  isFeatureEnabled("pod-staking-pool") && {
    name: "pod-staking",
    href: "/pools/pod-staking",
    displayAs: <Trans>POD Staking</Trans>,
  },
].filter(Boolean);

export const PoolsTabs = ({ active, children }) => {
  const { poolsTvl: tvl, liquidityTokenDecimals } = useAppConstants();
  const router = useRouter();

  return (
    <>
      <Hero>
        <Container className="flex flex-wrap px-2 py-20">
          <HeroTitle>
            <Trans>Bond and Staking Pools</Trans>
          </HeroTitle>

          {/* Total Value Locked */}
          <HeroStat title="Total Value Locked">
            {
              formatCurrency(
                convertFromUnits(tvl, liquidityTokenDecimals),
                router.locale
              ).long
            }
          </HeroStat>
        </Container>

        <TabNav headers={headers} activeTab={active} />
      </Hero>

      {children}
    </>
  );
};
