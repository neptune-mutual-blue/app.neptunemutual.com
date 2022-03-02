import { NeutralButton } from "@/components/UI/atoms/button/neutral-button";
import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { SearchAndSortBar } from "@/components/UI/molecules/search-and-sort";
import { StakingCard } from "@/components/UI/organisms/pools/staking/StakingCard";
import { useTokenStakingPools } from "@/src/hooks/useTokenStakingPools";

export const StakingPage = () => {
  const { data, loading } = useTokenStakingPools();

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
            No <span className="whitespace-nowrap">staking pools found.</span>
          </p>
        </div>
      )}
      <Grid className="mt-14 mb-24">
        {data.pools.map((poolData) => {
          return <StakingCard key={poolData.id} data={poolData} />;
        })}
      </Grid>
      <NeutralButton className={"rounded-lg"}>Show More</NeutralButton>
    </Container>
  );
};
