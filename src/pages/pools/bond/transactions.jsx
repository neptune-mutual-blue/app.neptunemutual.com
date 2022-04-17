import { ComingSoon } from "@/src/common/components/ComingSoon";
import { BreadCrumbs } from "@/src/common/components/breadcrumbs";
import { Container } from "@/src/common/components/container";
import { Hero } from "@/src/common/components/Hero";
import { HeroTitle } from "@/src/common/components/HeroTitle";
import { MyBondTxsTable } from "@/src/modules/pools/bond/MyBondTxsTable";
import { isFeatureEnabled } from "@/src/config/environment";
import Head from "next/head";

export function getStaticProps() {
  return {
    props: {
      disabled: !isFeatureEnabled("bond"),
    },
  };
}

export default function MyBondTxs({ disabled }) {
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
              { name: "Pool", href: "/pools/bond", current: false },
              {
                name: "Bond",
                current: false,
              },
              {
                name: "Transaction List",
                href: "/pools/bond/transactions",
                current: true,
              },
            ]}
          />
          <HeroTitle>Transaction List</HeroTitle>
        </Container>
        <hr className="border-b border-B0C4DB" />
      </Hero>

      <Container className="pt-14 pb-28">
        <MyBondTxsTable />
      </Container>
    </main>
  );
}
