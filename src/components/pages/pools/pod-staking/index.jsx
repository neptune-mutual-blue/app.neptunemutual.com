import { NeutralButton } from "@/components/UI/atoms/button/neutral-button";
import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { SearchAndSortBar } from "@/components/UI/molecules/search-and-sort";
import { PodStakingCard } from "@/components/UI/organisms/pools/pod-staking/PodStakingCard";
import { useAppConstants } from "@/src/context/AppConstants";
import { usePodStakingPools } from "@/src/hooks/usePodStakingPools";

export const PodStakingPage = () => {
  const { getTVLById } = useAppConstants();
  const { data, loading } = usePodStakingPools();

  return (
    <Container className={"pt-16 pb-36"}>
      <div className="flex justify-end">
        <SearchAndSortBar />
      </div>
      {loading && <div className="text-center py-10">Loading...</div>}
      {!loading && data.pools.length === 0 && (
        <div className="w-full flex flex-col items-center pt-20">
          <img
            src="/images/covers/empty-list-illustration.svg"
            alt="no data found"
            className="w-48 h-48"
          />
          <p className="text-h5 text-404040 text-center mt-8 w-96 max-w-full">
            No POD{" "}
            <span className="whitespace-nowrap">staking pools found.</span>
          </p>
        </div>
      )}
      <Grid className="mt-14 mb-24">
        {data.pools.map((poolData) => {
          return (
            <PodStakingCard
              key={poolData.id}
              data={poolData}
              tvl={getTVLById(poolData.id)}
            />
          );
        })}
      </Grid>
      <NeutralButton className={"rounded-lg"}>Show More</NeutralButton>
    </Container>
  );
};
