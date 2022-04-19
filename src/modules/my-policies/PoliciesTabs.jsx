import { useActivePolicies } from "@/src/hooks/useActivePolicies";
import { Container } from "@/common/Container/Container";
import { Hero } from "@/common/Hero";
import { HeroStat } from "@/common/HeroStat";
import { HeroTitle } from "@/common/HeroTitle";
import { TabNav } from "@/common/Tab/TabNav";
import { convertFromUnits } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";

const headers = [
  {
    name: "active",
    href: "/my-policies/active",
    displayAs: "Active",
  },
  {
    name: "expired",
    href: "/my-policies/expired",
    displayAs: "Expired",
  },
];

export const PoliciesTabs = ({ active, children }) => {
  const { data } = useActivePolicies();
  const { totalActiveProtection } = data;

  return (
    <>
      <Hero>
        <Container className="flex flex-wrap px-2 py-20">
          <HeroTitle>My Policies</HeroTitle>

          {/* Total Active Protection */}
          <HeroStat title="Total Active Protection">
            {formatCurrency(convertFromUnits(totalActiveProtection)).long}
          </HeroStat>
        </Container>

        <TabNav headers={headers} activeTab={active} />
      </Hero>

      {children}
    </>
  );
};
