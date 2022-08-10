import { isFeatureEnabled } from "@/src/config/environment";
import { ClaimDetailsPage } from "@/modules/my-policies/ClaimDetailsPage";

export function getServerSideProps() {
  return {
    props: {
      disabled: !isFeatureEnabled("claim"),
    },
  };
}

export default function ClaimPolicyDedicatedCover({ disabled }) {
  return <ClaimDetailsPage disabled={disabled} />;
}
