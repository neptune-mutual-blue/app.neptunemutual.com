import Link from "next/link";

import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { ActivePolicyCard } from "@/components/UI/organisms/policy/ActivePolicyCard";
import { useActivePolicies } from "@/components/pages/my-policies/useActivePolicies";

export const PoliciesActivePage = () => {
  const { data, loading } = useActivePolicies();
  const { activePolicies } = data;

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
      {!loading && activePolicies.length === 0 && (
        <div className="text-center py-10">No data found</div>
      )}
      <Grid className="mt-14 mb-24">
        {activePolicies.map((policyInfo) => {
          return (
            <div
              key={policyInfo.id}
              className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9"
            >
              <ActivePolicyCard details={policyInfo}></ActivePolicyCard>
            </div>
          );
        })}
      </Grid>
    </Container>
  );
};
