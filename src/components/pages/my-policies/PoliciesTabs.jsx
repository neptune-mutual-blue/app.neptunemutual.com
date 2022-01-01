import { Container } from "@/components/UI/atoms/container";
import { Hero } from "@/components/UI/molecules/Hero";
import { HeroStat } from "@/components/UI/molecules/HeroStat";
import { HeroTitle } from "@/components/UI/molecules/HeroTitle";
import { TabNav } from "@/components/UI/molecules/tabnav";

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
  return (
    <>
      <Hero>
        <Container className="px-2 flex py-20">
          <HeroTitle>My Policies</HeroTitle>

          {/* My Active Protection */}
          <HeroStat title="My Active Protection">
            <>$ 150,000.00</>
          </HeroStat>
        </Container>

        <TabNav headers={headers} activeTab={active} />
      </Hero>

      {children}
    </>
  );
};
