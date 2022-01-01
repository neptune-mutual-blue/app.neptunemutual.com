import { Container } from "@/components/UI/atoms/container";
import { Hero } from "@/components/UI/molecules/Hero";
import { HeroTitle } from "@/components/UI/molecules/HeroTitle";
import { TabNav } from "@/components/UI/molecules/tabnav";

const headers = [
  {
    name: "active",
    href: "/reporting/active",
    displayAs: "Active",
  },
  {
    name: "resolved",
    href: "/reporting/resolved",
    displayAs: "Resolved",
  },
];

export const ReportingTabs = ({ active, children }) => {
  return (
    <>
      <Hero>
        <Container className="px-2 py-20">
          <HeroTitle>Reporting</HeroTitle>
        </Container>

        <TabNav headers={headers} activeTab={active} />
      </Hero>

      {children}
    </>
  );
};
