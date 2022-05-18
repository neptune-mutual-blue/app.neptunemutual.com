/* istanbul ignore file */
import { t, Trans } from "@lingui/macro";

import { NeutralButton } from "@/common/Button/NeutralButton";
import { Grid } from "@/common/Grid/Grid";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { CARDS_PER_PAGE } from "@/src/config/constants";
import { StakingCard } from "@/modules/pools/staking/StakingCard";

export function Content({
  data,
  loading,
  hasMore,
  handleShowMore,
  getPriceByAddress,
}) {
  console.log("fetch data", data);
  if (data.length) {
    return (
      <>
        <Grid className="mb-24 mt-14" role="grid">
          {data.map((poolData) => (
            <StakingCard
              key={poolData.id}
              data={poolData}
              tvl={poolData.tvl}
              getPriceByAddress={getPriceByAddress}
            />
          ))}
        </Grid>
        {!loading && hasMore && (
          <NeutralButton
            className={"rounded-lg border-0.5"}
            onClick={handleShowMore}
          >
            <Trans>Show More</Trans>
          </NeutralButton>
        )}
      </>
    );
  }

  if (loading) {
    return (
      <Grid className="mb-24 mt-14">
        <CardSkeleton numberOfCards={data.length || CARDS_PER_PAGE} />
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
          No <span className="whitespace-nowrap">staking pools found.</span>
        </Trans>
      </p>
    </div>
  );
}
