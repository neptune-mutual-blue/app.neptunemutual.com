import { TabNav } from "@/components/UI/molecules/tabnav";
import { ReportingHero } from "@/components/UI/organisms/reporting/hero";

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
    <main>
      <ReportingHero>
        <TabNav headers={headers} activeTab={active} />
      </ReportingHero>

      {children}
    </main>
  );
};
