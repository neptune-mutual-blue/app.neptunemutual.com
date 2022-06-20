import { BasketCoverPoolsHero } from "@/common/BasketCoverPoolsHero";
import { ComingSoon } from "@/common/ComingSoon";
import { BasketCardGrids } from "@/modules/basket/grid";
import { isV2BasketCoverEnabled } from "@/src/config/environment";
import Head from "next/head";

export function getServerSideProps() {
  return {
    props: {
      disabled: !isV2BasketCoverEnabled(),
    },
  };
}

export default function BasketsCoverpool({ disabled }) {
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

      <BasketCoverPoolsHero />
      <BasketCardGrids />
    </main>
  );
}
