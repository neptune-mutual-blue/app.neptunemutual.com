import Head from "next/head";
import HomePage from "@/modules/home";

export default function DiversifiedCovers() {
  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>
      <HomePage showDiversifiedList />
    </main>
  );
}
