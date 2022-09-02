import Head from "next/head";
import { PoliciesTabs } from "@/src/modules/my-policies/PoliciesTabs";
import { PoliciesActivePage } from "@/src/modules/my-policies/active/PoliciesActivePage";
import { ComingSoon } from "@/common/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";
import { generateNonce, setCspHeaderWithNonce } from "@/utils/cspHeader";

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

export const getServerSideProps = async ({ req: _, res }) => {
  const nonce = generateNonce();

  setCspHeaderWithNonce(res, nonce);

  return {
    props: {
      nonce,
      disabled: !isFeatureEnabled("policy"),
    },
  };
};
