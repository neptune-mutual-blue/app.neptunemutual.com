import { useActivePolicies } from "@/src/hooks/useActivePolicies";
import { Container } from "@/components/UI/atoms/container";
import { Hero } from "@/components/UI/molecules/Hero";
import { HeroStat } from "@/components/UI/molecules/HeroStat";
import { HeroTitle } from "@/components/UI/molecules/HeroTitle";
import { TabNav } from "@/components/UI/molecules/tabnav";
import { convertFromUnits } from "@/utils/bn";
import { formatAmount } from "@/utils/formatter";

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
        <Container className="px-2 flex py-20">
          <HeroTitle>My Policies</HeroTitle>

          {/* Total Active Protection */}
          <HeroStat title="Total Active Protection">
            {formatAmount(convertFromUnits(totalActiveProtection).toString())}
          </HeroStat>
        </Container>

        <TabNav headers={headers} activeTab={active} />
      </Hero>

      {children}
    </>
  );
};
