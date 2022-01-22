import { useAvailableStakings } from "@/components/pages/pools/staking/useAvailableStakings";
import { NeutralButton } from "@/components/UI/atoms/button/neutral-button";
import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { SearchAndSortBar } from "@/components/UI/molecules/search-and-sort";
import { StakingCard } from "@/components/UI/organisms/pools/staking/StakingCard";
import { useState } from "react";

export const StakingPage = () => {
  const { availableStakings } = useAvailableStakings();
  const earningPercent = 25;
  const [staked, setStaked] = useState([]);

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

  if (!availableStakings || !earningPercent) {
    return <>loading...</>;
  }

  return (
    <Container className={"pt-16 pb-36"}>
      <div className="flex justify-end">
        <SearchAndSortBar />
      </div>
      <Grid className="mt-14 mb-24">
        {availableStakings.map((c) => {
          const onStake = handleStake;
          const earnPercent = earningPercent;
          const props = {
            ...c,
            staked,
            onStake,
            earnPercent,
          };

          return <StakingCard key={c.name} {...props} />;
        })}
      </Grid>
      <NeutralButton className={"rounded-lg"}>Show More</NeutralButton>
    </Container>
  );
};
