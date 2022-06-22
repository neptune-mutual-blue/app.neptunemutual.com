import Head from "next/head";
import { HomeHero } from "@/modules/home/Hero";
import { ProductsGrid } from "@/common/ProductsGrid/ProductsGrid";
import { isV2BasketCoverEnabled } from "@/src/config/environment";

export function getServerSideProps() {
  return {
    props: {
      disabled: !isV2BasketCoverEnabled(),
    },
  };
}

export default function BasketsCoverpool() {
  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>
      <HomeHero />
      <ProductsGrid />
    </main>
  );
}
