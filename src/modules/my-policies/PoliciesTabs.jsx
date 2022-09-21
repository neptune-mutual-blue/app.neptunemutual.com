import { useActivePolicies } from "@/src/hooks/useActivePolicies";
import { Container } from "@/common/Container/Container";
import { Hero } from "@/common/Hero";
import { HeroStat } from "@/common/HeroStat";
import { HeroTitle } from "@/common/HeroTitle";
import { TabNav } from "@/common/Tab/TabNav";
import { convertFromUnits } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";
import { useAppConstants } from "@/src/context/AppConstants";

const headers = [
  {
    name: "active",
    href: "/my-policies/active",
    displayAs: <Trans>Active</Trans>,
  },
  {
    name: "expired",
    href: "/my-policies/expired",
    displayAs: <Trans>Expired</Trans>,
  },
];

export const PoliciesTabs = ({ active, children }) => {
  const {
    data: { totalActiveProtection, activePolicies },
    loading,
  } = useActivePolicies();
  const router = useRouter();
  const { liquidityTokenDecimals } = useAppConstants();

  return (
    <>
      <Hero>
        <Container className="flex flex-wrap px-2 py-32">
          <HeroTitle>
            <Trans>My Policies</Trans>
          </HeroTitle>

          {/* Total Active Protection */}
          <HeroStat title={t`Total Active Protection`}>
            {
              formatCurrency(
                convertFromUnits(totalActiveProtection, liquidityTokenDecimals),
                router.locale
              ).long
            }
          </HeroStat>
        </Container>

        <TabNav headers={headers} activeTab={active} />
      </Hero>

      {children({ data: activePolicies, loading })}
    </>
  );
};
