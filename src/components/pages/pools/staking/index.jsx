import { useAvailableStakings } from "@/components/pages/pools/staking/useAvailableStakings";
import { useEarningPercentage } from "@/components/pages/pools/staking/useEarningPercentage";
import { NeutralButton } from "@/components/UI/atoms/button/neutral-button";
import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { SearchAndSortBar } from "@/components/UI/molecules/pools/search-and-sort";
import { StakingCard } from "@/components/UI/organisms/pools/staking/staking-card";
import Link from "next/link";
import { useState } from "react";

export const StakingPage = () => {
  const { availableStakings } = useAvailableStakings();
  const { earningPercent } = useEarningPercentage();
  const [staked, setStaked] = useState([]);

  if (!availableStakings) {
    return <>loading...</>;
  }
  if (!earningPercent) {
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
      <SearchAndSortBar />
      <Grid className="mt-14 mb-24">
        {availableStakings.map((c) => {
          return (
            <StakingCard
              key={c.name}
              id={c.id}
              details={c}
              staked={staked}
              onStake={handleStake}
              earnPercent={earningPercent}
            ></StakingCard>
          );
        })}
      </Grid>
      <NeutralButton className={"rounded-lg"}>Show More</NeutralButton>
    </Container>
  );
};
