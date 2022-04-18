import Link from "next/link";

import { Container } from "@/common/components/Container/Container";
import { Grid } from "@/common/components/Grid/Grid";
import { useExpiredPolicies } from "@/src/hooks/useExpiredPolicies";
import { PolicyCard } from "@/src/modules/my-policies/PolicyCard";
import { CardSkeleton } from "@/src/common/components/Skeleton/CardSkeleton";
import { COVERS_PER_PAGE } from "@/src/config/constants";

export const PoliciesExpiredPage = () => {
  const { data, loading } = useExpiredPolicies();
  const { expiredPolicies } = data;

  const renderMyExpiredPolicies = () => {
    const noData = expiredPolicies.length <= 0;

    if (!loading && !noData) {
      return (
        <Grid className="mb-24 mt-14">
          {expiredPolicies.map((policyInfo) => {
            return (
              <PolicyCard
                key={policyInfo.id}
                policyInfo={policyInfo}
              ></PolicyCard>
            );
          })}
        </Grid>
      );
    } else if (!loading && noData) {
      return (
        <div className="flex flex-col items-center w-full pt-20">
          <img
            src="/images/covers/empty-list-illustration.svg"
            alt="no data found"
            className="w-48 h-48"
          />
          <p className="max-w-full mt-8 text-center text-h5 text-404040 w-96">
            When a policy&apos;s duration ends, it automatically moves to this
            section. Explore products on the home screen to view available
            protections.
          </p>
        </div>
      );
    }

    return (
      <Grid className="mb-24 mt-14">
        <CardSkeleton
          numberOfCards={COVERS_PER_PAGE}
          statusBadge={false}
          subTitle={false}
        />
      </Grid>
    );
  };

  return (
    <Container className="py-16">
      <div className="flex justify-end">
        <Link href="/my-policies/transactions">
          <a className="font-medium text-h4 text-4e7dd9 hover:underline">
            Transaction List
          </a>
        </Link>
      </div>
      {renderMyExpiredPolicies()}
    </Container>
  );
};
