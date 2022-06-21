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

export const PoliciesTabs = ({ active, children }) => {
  const { data } = useActivePolicies();
  const { totalActiveProtection } = data;

  const router = useRouter();
  const { cover_id, product_id } = router.query;
  const { liquidityTokenDecimals } = useAppConstants();

  const headers = [
    {
      name: "active",
      href: `/covers/${cover_id}/${product_id}/active`,
      displayAs: t`Active`,
    },
    {
      name: "expired",
      href: `/covers/${cover_id}/${product_id}/expired`,
      displayAs: t`Expired`,
    },
  ];

  return (
    <>
      <Hero>
        <Container className="flex flex-wrap px-2 py-20">
          <HeroTitle>
            <Trans>My Policies</Trans>
          </HeroTitle>

          {/* Total Active Protection */}
          <HeroStat title="Total Active Protection">
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

      {children}
    </>
  );
};