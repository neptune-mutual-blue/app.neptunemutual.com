import { Container } from "@/components/UI/atoms/container";
import { Hero } from "@/components/UI/molecules/Hero";
import { HeroStat } from "@/components/UI/molecules/HeroStat";
import { HeroTitle } from "@/components/UI/molecules/HeroTitle";
import { TabNav } from "@/components/UI/molecules/tabnav";
import { formatAmount } from "@/utils/formatter";

const headers = [
  {
    name: "bond",
    href: "/pools/bond",
    displayAs: "Bond",
  },
  {
    name: "staking",
    href: "/pools/staking",
    displayAs: "Staking",
  },
  {
    name: "pod-staking",
    href: "/pools/pod-staking",
    displayAs: "POD Staking",
  },
];

export const PoolsTabs = ({ active, children }) => {
  return (
    <>
      <Hero>
        <Container className="px-2 flex py-20">
          <HeroTitle>Bond and Staking Pools</HeroTitle>

          {/* Total Value Locked */}
          <HeroStat title="Total Value Locked">
            {formatAmount("150000".toString())}
          </HeroStat>
        </Container>

        <TabNav headers={headers} activeTab={active} />
      </Hero>

      {children}
    </>
  );
};
