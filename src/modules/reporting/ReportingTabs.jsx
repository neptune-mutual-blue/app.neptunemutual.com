import { Container } from "@/common/Container/Container";
import { Hero } from "@/common/Hero";
import { HeroTitle } from "@/common/HeroTitle";
import { TabNav } from "@/common/Tab/TabNav";
import { Routes } from "@/src/config/routes";
import { Trans } from "@lingui/macro";

const headers = [
  {
    name: "active",
    href: Routes.ActiveReports,
    displayAs: <Trans>Active</Trans>,
  },
  {
    name: "resolved",
    href: Routes.ResolvedReports,
    displayAs: <Trans>Resolved</Trans>,
  },
];

export const ReportingTabs = ({ active, children }) => {
  return (
    <>
      <Hero>
        <Container className="px-2 py-20 min-h-[347px] flex flex-col justify-center">
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
