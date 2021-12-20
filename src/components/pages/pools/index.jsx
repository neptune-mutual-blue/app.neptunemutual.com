import { Staking } from "@/components/pages/pools/staking";
import { TabHeader } from "@/components/UI/molecules/pools/pools-hero/tabbed-header";
import { PoolHero } from "@/components/UI/organisms/pools/hero";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const PoolsPage = () => {
  const router = useRouter();
  let currentPath = router.query.pools;

  const [activeTab, setActiveTab] = useState(1);

  /* Add component to render accordingly like <Bond>,<Staking */
  /* Used in object to create a tab component as well as keep track of active tab  */
  const headers = [
    {
      id: 1,
      name: "bond",
      displayAs: "Bond",
    },
    {
      id: 2,
      name: "staking",
      displayAs: "Staking",
      componentToRender: <Staking />,
    },
    {
      id: 3,
      name: "pod_staking",
      displayAs: "POD Staking",
    },
  ];

  const findNameMatchingComponent = () =>
    headers.find((cmp) => {
      return cmp.name === currentPath;
    });

  const getActiveUI = () => {
    let currentPage = headers.find((tab) => {
      return tab.name === currentPath;
    });
    setActiveTab(currentPage?.id);
  };

  useEffect(() => {
    const foundComponent = findNameMatchingComponent();
    if (currentPath && !foundComponent) router.push("/pools/bond");
    if (currentPath) getActiveUI();
  }, [router]);

  const cmp = findNameMatchingComponent()?.componentToRender;

  const handleTabClick = (e) => {
    let clickedOn = e.target.getAttribute("data-id");
    setActiveTab(clickedOn);
    /* router.push(`/pools/${activeTab}`); */
  };

  return (
    <div>
      <main className="bg-gray-bg">
        {/* hero */}
        <PoolHero title={"Bond and Staking Pools"}></PoolHero>
      </main>
      <div className="pt-12 pb-24 border-t border-t-poolBorder relative">
        <div className="absolute -top-12 ml-28">
          <TabHeader
            headers={headers}
            activeTab={activeTab}
            onClick={handleTabClick}
          />
        </div>
        {cmp}
      </div>
    </div>
  );
};
