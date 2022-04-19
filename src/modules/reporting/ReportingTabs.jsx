import { Container } from "@/common/Container/Container";
import { Hero } from "@/common/Hero";
import { HeroTitle } from "@/common/HeroTitle";
import { TabNav } from "@/common/Tab/TabNav";

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
