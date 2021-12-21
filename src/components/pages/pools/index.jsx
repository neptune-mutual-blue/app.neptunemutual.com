import { Staking } from "@/components/pages/pools/staking";
import { TabNav } from "@/components/UI/molecules/pools/pools-hero/tabnav";
import { PoolHero } from "@/components/UI/organisms/pools/hero";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

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

export const PoolsPage = ({ active, children }) => {
  return (
    <main className="bg-F1F3F6">
      {/* hero */}
      <PoolHero title="Bond and Staking Pools">
        <TabNav headers={headers} activeTab={active} />
      </PoolHero>

      {children}
    </main>
  );
};
