import Head from "next/head";

import { Container } from "@/components/UI/atoms/container";
import { Hero } from "@/components/UI/molecules/Hero";
import { HeroTitle } from "@/components/UI/molecules/HeroTitle";
import { HeroStat } from "@/components/UI/molecules/HeroStat";
import { MyLiquidityPage } from "@/components/pages/my-liquidity";
import { formatCurrency } from "@/utils/formatter/currency";
import PageNotFound from "@/src/pages/404";

// This gets called on every request
export async function getServerSideProps() {
  // Pass data to the page via props
  return {
    props: {
      disabled: !!process.env.NEXT_PUBLIC_DISABLE_ADD_LIQUIDITY,
    },
  };
}

export default function MyLiquidity({ disabled }) {
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
        <Container className="px-2 flex py-20">
          <HeroTitle>My Liquidity</HeroTitle>
          <HeroStat title="My Total Liquidity">
            <>$ {formatCurrency(150000, "USD", true).long}</>
          </HeroStat>
        </Container>
        <hr className="border-b border-B0C4DB" />
      </Hero>

      <MyLiquidityPage />
    </main>
  );
}
