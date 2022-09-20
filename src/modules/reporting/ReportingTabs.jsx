import { Container } from "@/common/Container/Container";
import { Hero } from "@/common/Hero";
import { HeroTitle } from "@/common/HeroTitle";
import { TabNav } from "@/common/Tab/TabNav";
import { Trans } from "@lingui/macro";

const headers = [
  {
    name: "active",
    href: "/reports/active",
    displayAs: <Trans>Active</Trans>,
  },
  {
    name: "resolved",
    href: "/reports/resolved",
    displayAs: <Trans>Resolved</Trans>,
  },
];

export const ReportingTabs = ({ active, children }) => {
  return (
    <>
      <Hero>
        <Container className="px-2 py-20">
          <HeroTitle>
            <Trans>Reporting</Trans>
          </HeroTitle>
        </Container>

        <TabNav headers={headers} activeTab={active} />
      </Hero>

      {children}
    </>
  );
};
