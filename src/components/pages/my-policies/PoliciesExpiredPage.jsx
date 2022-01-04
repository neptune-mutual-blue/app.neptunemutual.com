import Link from "next/link";

import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";

import { PolicyCard } from "@/components/UI/organisms/policy/card";
import { usePolicies } from "@/components/pages/my-policies/usePolicies";

export const PoliciesExpiredPage = () => {
  const { expiredPolicy } = usePolicies();

  if (!expiredPolicy) {
    return <>loading...</>;
  }

  return (
    <Container className="py-16">
      <div className="flex justify-end">
        <Link href="/my-policies/transactions">
          <a className="text-h4 font-medium text-4E7DD9 hover:underline">
            Transaction List
          </a>
        </Link>
      </div>
      <Grid className="mt-14 mb-24">
        {expiredPolicy.map((c) => {
          return (
            <div
              key={c.name}
              className="rounded-3xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-black focus:outline-none"
            >
              <PolicyCard details={c}></PolicyCard>
            </div>
          );
        })}
      </Grid>
    </Container>
  );
};
