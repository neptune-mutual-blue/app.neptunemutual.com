import Head from "next/head";
import { MyLiquidityCoverPage } from "@/components/pages/my-liquidity/details";

export default function MyLiquidityCover() {
  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>

      <MyLiquidityCoverPage />
    </main>
  );
}
