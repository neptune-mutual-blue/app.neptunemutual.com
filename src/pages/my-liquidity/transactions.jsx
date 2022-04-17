import Head from "next/head";
import { ComingSoon } from "@/src/common/components/ComingSoon";
import { BreadCrumbs } from "@/src/common/components/breadcrumbs";
import { Container } from "@/src/common/components/container";
import { Hero } from "@/src/common/components/Hero";
import { HeroTitle } from "@/src/common/components/HeroTitle";
import { MyLiquidityTxsTable } from "@/src/modules/my-liquidity/MyLiquidityTxsTable";
import { isFeatureEnabled } from "@/src/config/environment";

export function getStaticProps() {
  return {
    props: {
      disabled: !isFeatureEnabled("liquidity"),
    },
  };
}

export default function MyLiquidityTxs({ disabled }) {
  if (disabled) {
    return <ComingSoon />;
  }

  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>

      <Hero>
        <Container className="px-2 py-20">
          <BreadCrumbs
            pages={[
              { name: "My Liquidity", href: "/my-liquidity", current: false },
              {
                name: "Transaction List",
                href: "/my-liquidity/transactions",
                current: true,
              },
            ]}
          />
          <HeroTitle>Transaction List</HeroTitle>
        </Container>
        <hr className="border-b border-B0C4DB" />
      </Hero>

      <Container className="pt-14 pb-28">
        <MyLiquidityTxsTable />
      </Container>
    </main>
  );
}
