import Head from "next/head";

import { CoverPurchaseDetailsPage } from "@/components/pages/cover/purchase";
import PageNotFound from "@/src/pages/404";

// This gets called on every request
export async function getServerSideProps() {
  // Pass data to the page via props
  return {
    props: {
      disabled: !!process.env.NEXT_PUBLIC_DISABLE_PURCHASE,
      liquidityDisabled: !!process.env.NEXT_PUBLIC_DISABLE_ADD_LIQUIDITY,
    },
  };
}

export default function CoverPurchaseDetails({ disabled }) {
  if (disabled) {
    return <PageNotFound />;
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
