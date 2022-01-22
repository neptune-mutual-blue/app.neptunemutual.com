import { NeutralButton } from "@/components/UI/atoms/button/neutral-button";
import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { SearchAndSortBar } from "@/components/UI/molecules/search-and-sort";
import { PodStakingCard } from "@/components/UI/organisms/pools/pod-staking/PodStakingCard";
import { usePodStakingPools } from "@/src/hooks/usePodStakingPools";
import { useState } from "react";

export const PodStakingPage = () => {
  const { data } = usePodStakingPools();
  const [staked, setStaked] = useState("");

  const handleStake = () => {
    setStaked("150000");
  };

  return (
    <Container className={"pt-16 pb-36"}>
      <div className="flex justify-end">
        <SearchAndSortBar />
      </div>
      <Grid className="mt-14 mb-24">
        {data.pools.map((poolInfo) => {
          return (
            <PodStakingCard
              key={poolInfo.id}
              info={poolInfo}
              onStake={handleStake}
              hasStaked={staked}
            />
          );
        })}
      </Grid>
      <NeutralButton className={"rounded-lg"}>Show More</NeutralButton>
    </Container>
  );
};
