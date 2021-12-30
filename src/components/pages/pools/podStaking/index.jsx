import { useAvailablePodStakings } from "@/components/pages/pools/podStaking/useAvailablePodStakings";
import { useEarningPercentage } from "@/components/pages/pools/staking/useEarningPercentage";
import { NeutralButton } from "@/components/UI/atoms/button/neutral-button";
import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { SearchAndSortBar } from "@/components/UI/molecules/search-and-sort";
import { StakingCard } from "@/components/UI/organisms/pools/staking/staking-card";
import { useState } from "react";

export const PodStakingPage = () => {
  const { availablePodStakings } = useAvailablePodStakings();
  const { earningPercent } = useEarningPercentage();
  const [staked, setStaked] = useState([]);

  if (!availablePodStakings || !earningPercent) {
    return <>loading...</>;
  }

  const handleStake = (id, stakedAmt) => {
    let currentState = [...staked];
    let updatingElement = { ...currentState[id] };
    if (updatingElement.stakedAmt) {
      updatingElement.stakedAmt = updatingElement.stakedAmt + stakedAmt;
    } else {
      updatingElement.id = id;
      updatingElement.stakedAmt = stakedAmt;
    }
    currentState[id] = updatingElement;
    setStaked(currentState);
  };

  return (
    <Container className={"pt-16 pb-36"}>
      <div className="flex justify-end">
        <SearchAndSortBar />
      </div>
      <Grid className="mt-14 mb-24">
        {availablePodStakings.map((c) => {
          return (
            <StakingCard
              key={c.name}
              id={c.id}
              details={c}
              staked={staked}
              onStake={handleStake}
              earnPercent={earningPercent}
              fromPage={"podstaking"}
            ></StakingCard>
          );
        })}
      </Grid>
      <NeutralButton className={"rounded-lg"}>Show More</NeutralButton>
    </Container>
  );
};
