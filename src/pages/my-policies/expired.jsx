import Head from "next/head";
import { PoliciesTabs } from "@/components/pages/my-policies/PoliciesTabs";
import { PoliciesExpiredPage } from "@/components/pages/my-policies/PoliciesExpiredPage";

export default function MyPoliciesExpired() {
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
