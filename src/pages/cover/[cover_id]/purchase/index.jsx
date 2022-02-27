import Head from "next/head";

import { CoverPurchaseDetailsPage } from "@/components/pages/cover/purchase";

export default function CoverPurchaseDetails() {
  return (
    <>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>
      <CoverPurchaseDetailsPage />
    </>
  );
}
