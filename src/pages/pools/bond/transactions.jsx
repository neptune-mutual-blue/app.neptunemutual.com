import { ComingSoon } from "@/common/ComingSoon";
import { BreadCrumbs } from "@/common/BreadCrumbs/BreadCrumbs";
import { Container } from "@/common/Container/Container";
import { Hero } from "@/common/Hero";
import { HeroTitle } from "@/common/HeroTitle";
import { MyBondTxsTable } from "@/src/modules/pools/bond/MyBondTxsTable";
import { isFeatureEnabled } from "@/src/config/environment";
import Head from "next/head";
import { t, Trans } from "@lingui/macro";

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
              { name: t`Pool`, href: "/pools/bond", current: false },
              {
                name: t`Bond`,
                current: false,
              },
              {
                name: t`Transaction List`,
                href: "/pools/bond/transactions",
                current: true,
              },
            ]}
          />
          <HeroTitle>
            <Trans>Transaction List</Trans>
          </HeroTitle>
        </Container>
        <hr className="border-b border-B0C4DB" />
      </Hero>

      <Container className="pt-14 pb-28">
        <MyBondTxsTable />
      </Container>
    </main>
  );
}
