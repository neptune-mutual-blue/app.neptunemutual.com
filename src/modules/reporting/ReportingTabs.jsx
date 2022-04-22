import { Container } from "@/common/Container/Container";
import { Hero } from "@/common/Hero";
import { HeroTitle } from "@/common/HeroTitle";
import { TabNav } from "@/common/Tab/TabNav";
import { t, Trans } from "@lingui/macro";

const headers = [
  {
    name: "active",
    href: "/reporting/active",
    displayAs: t`Active`,
  },
  {
    name: "resolved",
    href: "/reporting/resolved",
    displayAs: t`Resolved`,
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
