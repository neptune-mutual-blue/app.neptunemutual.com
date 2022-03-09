import { ComingSoon } from "@/components/pages/ComingSoon";
import { BreadCrumbs } from "@/components/UI/atoms/breadcrumbs";
import { Container } from "@/components/UI/atoms/container";
import { Hero } from "@/components/UI/molecules/Hero";
import { HeroTitle } from "@/components/UI/molecules/HeroTitle";
import { MyBondTxsTable } from "@/components/UI/organisms/pools/MyBondTxsTable";
import { getFeatures } from "@/src/config/environment";
import Head from "next/head";

// This gets called on every request
export async function getServerSideProps() {
  // Pass data to the page via props
  const features = getFeatures();
  const enabled = features.indexOf("bond") > -1;

  return {
    props: {
      disabled: !enabled,
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
