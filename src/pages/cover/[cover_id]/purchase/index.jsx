import Head from "next/head";

import { CoverPurchaseDetailsPage } from "@/components/pages/cover/purchase";

// This gets called on every request
export async function getServerSideProps() {
  // Pass data to the page via props
  return {
    props: {
      disabled: !!process.env.DISABLE_PURCHASE,
    },
  };
}

export default function CoverPurchaseDetails({ disabled }) {
  if (disabled) {
    console.log(disabled);
    return <>This feature is not available yet</>;
  }

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
