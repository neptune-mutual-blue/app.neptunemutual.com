import { BreadCrumbs } from "@/components/UI/atoms/breadcrumbs";
import { Container } from "@/components/UI/atoms/container";
import { Hero } from "@/components/UI/molecules/Hero";
import { HeroTitle } from "@/components/UI/molecules/HeroTitle";
import { MyLiquidityTxsTable } from "@/components/UI/organisms/my-liquidity/MyLiquidityTxsTable";
import { getFeatures } from "@/src/config/environment";
import PageNotFound from "@/src/pages/404";
import Head from "next/head";

// This gets called on every request
export async function getServerSideProps() {
  // Pass data to the page via props
  const features = getFeatures();
  const enabled = features.indexOf("liquidity") > -1;

  return {
    props: {
      disabled: !enabled,
    },
  };
}

export default function MyLiquidityTxs({ disabled }) {
  if (disabled) {
    return <PageNotFound />;
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
