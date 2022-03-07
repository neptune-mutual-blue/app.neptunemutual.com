import Head from "next/head";
import { PoliciesTabs } from "@/components/pages/my-policies/PoliciesTabs";
import { PoliciesExpiredPage } from "@/components/pages/my-policies/PoliciesExpiredPage";

// This gets called on every request
export async function getServerSideProps() {
  // Pass data to the page via props
  return {
    props: {
      disabled: !!process.env.DISABLE_PURCHASE,
    },
  };
}

export default function MyPoliciesExpired({ disabled }) {
  if (disabled) {
    console.log(disabled);
    return <>This feature is not available yet</>;
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
      <PoliciesTabs active="expired">
        <PoliciesExpiredPage />
      </PoliciesTabs>
    </main>
  );
}
