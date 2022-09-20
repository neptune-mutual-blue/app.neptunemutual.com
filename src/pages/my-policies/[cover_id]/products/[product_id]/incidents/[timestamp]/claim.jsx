import { isFeatureEnabled } from "@/src/config/environment";
import { ClaimDetailsPage } from "@/modules/my-policies/ClaimDetailsPage";

const disabled = !isFeatureEnabled("claim");

export default function ClaimPolicyDiversifiedProduct() {
  return <ClaimDetailsPage disabled={disabled} />;
}
