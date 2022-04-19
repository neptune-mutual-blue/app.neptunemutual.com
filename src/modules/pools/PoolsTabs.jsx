import { Container } from "@/common/Container/Container";
import { Hero } from "@/common/Hero";
import { HeroStat } from "@/common/HeroStat";
import { HeroTitle } from "@/common/HeroTitle";
import { TabNav } from "@/common/Tab/TabNav";
import { isFeatureEnabled } from "@/src/config/environment";
import { useAppConstants } from "@/src/context/AppConstants";
import { convertFromUnits } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";

const headers = [
  isFeatureEnabled("bond") && {
    name: "bond",
    href: "/pools/bond",
    displayAs: "Bond",
  },
  isFeatureEnabled("staking-pool") && {
    name: "staking",
    href: "/pools/staking",
    displayAs: "Staking",
  },
  isFeatureEnabled("pod-staking-pool") && {
    name: "pod-staking",
    href: "/pools/pod-staking",
    displayAs: "POD Staking",
  },
].filter(Boolean);

export const PoolsTabs = ({ active, children }) => {
  const { poolsTvl: tvl } = useAppConstants();

  return (
    <>
      <Hero>
        <Container className="flex flex-wrap px-2 py-20">
          <HeroTitle>Bond and Staking Pools</HeroTitle>

          {/* Total Value Locked */}
          <HeroStat title="Total Value Locked">
            {formatCurrency(convertFromUnits(tvl)).long}
          </HeroStat>
        </Container>

        <TabNav headers={headers} activeTab={active} />
      </Hero>

      {children}
    </>
  );
};
