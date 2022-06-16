import { ProductsGrid } from "@/common/ProductsGrid";
import { HomeHero } from "@/modules/home/Hero";
import { t } from "@lingui/macro";
import Head from "next/head";
import Router from "next/router";

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
      <HomeHero
        title={`${Router.query.cover_id} mock title`}
        heroContainerClass="!pt-0"
        breadcrumbs={[
          { name: t`Baskets`, href: "/basket", current: false },
          { name: t`Foobar`, href: "/basket/foobar", current: true },
        ]}
      />
      <ProductsGrid />
    </main>
  );
}
