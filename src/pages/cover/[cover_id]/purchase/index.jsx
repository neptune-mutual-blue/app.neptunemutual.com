import Head from "next/head";

import { CoverPurchaseDetailsPage } from "@/components/pages/cover/purchase";
import PageNotFound from "@/src/pages/404";
import { getFeatures } from "@/src/config/environment";

// This gets called on every request
export async function getServerSideProps() {
  // Pass data to the page via props
  const features = getFeatures();
  const enabled = features.indexOf("policy") > -1;

  return {
    props: {
      disabled: !enabled,
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
