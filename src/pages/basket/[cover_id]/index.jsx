import Head from "next/head";
import { useRouter } from "next/router";
import { t } from "@lingui/macro";
import { HomeHero } from "@/modules/home/Hero";
import { ComingSoon } from "@/common/ComingSoon";
import { ProductsGrid } from "@/common/ProductsGrid/ProductsGrid";
import { isV2BasketCoverEnabled } from "@/src/config/environment";

export function getServerSideProps() {
  return {
    props: {
      disabled: !isV2BasketCoverEnabled(),
    },
  };
}

export default function BasketsCoverpool({ disabled }) {
  const router = useRouter();
  const { cover_id } = router.query;

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
      <HomeHero
        title={`${cover_id}`}
        heroContainerClass="!pt-0"
        breadcrumbs={[
          { name: t`Baskets`, href: "/basket", current: false },
          {
            name: cover_id,
            href: `/basket/${cover_id}`,
            current: true,
          },
        ]}
      />
      <ProductsGrid />
    </main>
  );
}
