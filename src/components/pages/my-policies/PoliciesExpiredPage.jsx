import Link from "next/link";

import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { useExpiredPolicies } from "@/src/hooks/useExpiredPolicies";
import { PolicyCard } from "@/components/UI/organisms/policy/PolicyCard";

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
        <div className="w-full flex flex-col items-center pt-20">
          <img
            src="/images/covers/empty-list-illustration.svg"
            alt="no data found"
            className="w-48 h-48"
          />
          <p className="text-h5 text-404040 text-center mt-8 w-96 max-w-full">
            All your purchased policies that has been expired will be{" "}
            <span className="whitespace-nowrap">displayed here.</span>
          </p>
        </div>
      )}
      <Grid className="mt-14 mb-24">
        {expiredPolicies.map((policyInfo) => {
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
