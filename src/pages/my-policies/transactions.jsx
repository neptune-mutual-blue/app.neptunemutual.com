import Head from "next/head";
import { BreadCrumbs } from "@/common/components/BreadCrumbs/BreadCrumbs";
import { Container } from "@/common/components/Container/Container";
import { Hero } from "@/src/common/components/Hero";
import { HeroTitle } from "@/src/common/components/HeroTitle";
import { MyPoliciesTxsTable } from "@/src/modules/my-policies/MyPoliciesTxsTable";
import { ComingSoon } from "@/src/common/components/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";

export function getStaticProps() {
  return {
    props: {
      disabled: !isFeatureEnabled("policy"),
    },
  };
}

export default function MyPoliciesTxs({ disabled }) {
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
              {
                name: "My Policies",
                href: "/my-policies/active",
                current: false,
              },
              { name: "Transaction List", href: "#", current: true },
            ]}
          />

          <HeroTitle>Transaction List</HeroTitle>
        </Container>

        <hr className="border-b border-B0C4DB" />
      </Hero>

      <Container className="pt-14 pb-28">
        <MyPoliciesTxsTable />
      </Container>
    </main>
  );
}
