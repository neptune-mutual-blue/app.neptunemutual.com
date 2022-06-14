import { BasketCardGrids } from "@/modules/basket/grid";
import Head from "next/head";

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

      <BasketCardGrids />
    </main>
  );
}
