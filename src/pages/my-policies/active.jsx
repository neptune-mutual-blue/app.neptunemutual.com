import Head from "next/head";
import { PoliciesTabs } from "@/src/modules/my-policies/PoliciesTabs";
import { PoliciesActivePage } from "@/src/modules/my-policies/active/PoliciesActivePage";
import { ComingSoon } from "@/common/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";

export function getStaticProps() {
  return {
    props: {
      disabled: !isFeatureEnabled("policy"),
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
