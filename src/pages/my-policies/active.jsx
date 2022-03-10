import Head from "next/head";
import { PoliciesTabs } from "@/components/pages/my-policies/PoliciesTabs";
import { PoliciesActivePage } from "@/components/pages/my-policies/PoliciesActivePage";
import { getFeatures } from "@/src/config/environment";
import { ComingSoon } from "@/components/pages/ComingSoon";

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

export default function MyPoliciesActive({ disabled }) {
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
      <PoliciesTabs active="active">
        <PoliciesActivePage />
      </PoliciesTabs>
    </main>
  );
}
