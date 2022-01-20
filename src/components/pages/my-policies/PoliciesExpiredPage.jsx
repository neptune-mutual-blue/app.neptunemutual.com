import Link from "next/link";

import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { ExpiredPolicyCard } from "@/components/UI/organisms/policy/ExpiredPolicyCard";
import { useExpiredPolicies } from "@/components/pages/my-policies/useExpiredPolicies";

export const PoliciesExpiredPage = () => {
  const { data, loading } = useExpiredPolicies();
  const { expiredPolicies } = data;

  return (
    <Container className="py-16">
      <div className="flex justify-end">
        <Link href="/my-policies/transactions">
          <a className="text-h4 font-medium text-4e7dd9 hover:underline">
            Transaction List
          </a>
        </Link>
      </div>
      {loading && <div className="text-center py-10">Loading...</div>}
      {!loading && expiredPolicies.length === 0 && (
        <div className="text-center py-10">No data found</div>
      )}
      <Grid className="mt-14 mb-24">
        {expiredPolicies.map((policyInfo) => {
          return (
            <div
              key={policyInfo.id}
              className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9"
            >
              <ExpiredPolicyCard details={policyInfo}></ExpiredPolicyCard>
            </div>
          );
        })}
      </Grid>
    </Container>
  );
};
