import { useAvailablePodStakings } from "@/components/pages/pools/podStaking/useAvailablePodStakings";
import { useEarningPercentage } from "@/components/pages/pools/staking/useEarningPercentage";
import { NeutralButton } from "@/components/UI/atoms/button/neutral-button";
import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { SearchAndSortBar } from "@/components/UI/molecules/search-and-sort";
import { PodStakingCard } from "@/components/UI/organisms/pools/pod-staking/PodStakingCard";
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
          const onStake = handleStake;
          const earnPercent = earningPercent;
          const props = {
            ...c,
            onStake,
            staked,
            earnPercent,
          };

          return <PodStakingCard key={c.name} {...props} />;
        })}
      </Grid>
      <NeutralButton className={"rounded-lg"}>Show More</NeutralButton>
    </Container>
  );
};
