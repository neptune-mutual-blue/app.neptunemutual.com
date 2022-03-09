import Link from "next/link";

import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { PolicyCard } from "@/components/UI/organisms/policy/PolicyCard";
import { useActivePolicies } from "@/src/hooks/useActivePolicies";

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
        <div className="w-full flex flex-col items-center pt-20">
          <img
            src="/images/covers/empty-list-illustration.svg"
            alt="no data found"
            className="w-48 h-48"
          />
          <p className="text-h5 text-404040 text-center mt-8 w-96 max-w-full">
            A cover policy enables you to claim and receive payout when an
            incident occurs. To purchase a policy, select a cover from the home
            screen.
          </p>
        </div>
      )}
      <Grid className="mt-14 mb-24">
        {activePolicies.map((policyInfo) => {
          return (
            <PolicyCard
              key={policyInfo.id}
              policyInfo={policyInfo}
            ></PolicyCard>
          );
        })}
      </Grid>
    </Container>
  );
};
