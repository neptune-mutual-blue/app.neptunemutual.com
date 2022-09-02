import { isFeatureEnabled } from "@/src/config/environment";
import { ClaimDetailsPage } from "@/modules/my-policies/ClaimDetailsPage";
import { generateNonce, setCspHeaderWithNonce } from "@/utils/cspHeader";

export default function ClaimPolicyDedicatedCover({ disabled }) {
  return <ClaimDetailsPage disabled={disabled} />;
}

export const getServerSideProps = async ({ req: _, res }) => {
  const nonce = generateNonce();

  setCspHeaderWithNonce(res, nonce);

  return {
    props: {
      nonce,
      disabled: !isFeatureEnabled("claim"),
    },
  };
};
