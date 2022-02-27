import Head from "next/head";
import { CoverOptionsPage } from "@/components/pages/cover/CoverOptionsPage";

export default function Options() {
  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>
      <CoverOptionsPage />
    </main>
  );
}
