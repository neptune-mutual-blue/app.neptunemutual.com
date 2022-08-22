import Link from "next/link";

import { Container } from "@/common/Container/Container";
import { Grid } from "@/common/Grid/Grid";
import { PolicyCard } from "@/src/modules/my-policies/PolicyCard";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { CARDS_PER_PAGE } from "@/src/config/constants";
import { t, Trans } from "@lingui/macro";

export const PoliciesActivePage = ({ data, loading }) => {
  return (
    <Container className="py-16">
      <div className="flex justify-end">
        <Link href="/my-policies/transactions">
          <a className="font-medium text-h4 text-4e7dd9 hover:underline">
            <Trans>Transaction List</Trans>
          </a>
        </Link>
      </div>
      <ActivePolicies data={data} loading={loading} />
    </Container>
  );
};

function ActivePolicies({ data: activePolicies, loading }) {
  if (loading) {
    return (
      <Grid className="mb-24 mt-14">
        <CardSkeleton
          numberOfCards={CARDS_PER_PAGE}
          statusBadge={false}
          subTitle={false}
        />
      </Grid>
    );
  }

  if (activePolicies.length) {
    return (
      <Grid className="mb-24 mt-14">
        {activePolicies.map((policyInfo) => {
          if (!policyInfo) return null;

          return <PolicyCard key={policyInfo.id} policyInfo={policyInfo} />;
        })}
      </Grid>
    );
  }

  return (
    <div className="flex flex-col items-center w-full pt-20">
      <img
        src="/images/covers/empty-list-illustration.svg"
        alt={t`no data found`}
        className="w-48 h-48"
      />
      <p className="max-w-full mt-8 text-center text-h5 text-404040 w-96">
        <Trans>
          A cover policy enables you to claim and receive payout when an
          incident occurs. To purchase a policy, select a cover from the home
          screen.
        </Trans>
      </p>
    </div>
  );
}
