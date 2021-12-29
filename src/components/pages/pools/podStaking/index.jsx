import { useAvailablePodStakings } from "@/components/pages/pools/podStaking/useAvailablePodStakings";
import { useEarningPercentage } from "@/components/pages/pools/staking/useEarningPercentage";
import { NeutralButton } from "@/components/UI/atoms/button/neutral-button";
import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { StakingCard } from "@/components/UI/organisms/pools/staking/staking-card";
import Link from "next/link";
import { useState } from "react";

export const PodStakingPage = () => {
  const { availablePodStakings } = useAvailablePodStakings();
  const { earningPercent } = useEarningPercentage();
  const [staked, setStaked] = useState([]);

  if (!availablePodStakings) {
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
      <div className="flex justify-between">
        <div>
          <span className="inline-block border border-B0C4DB p-4 mr-4 rounded-lg bg-white">
            search
          </span>
          <span className="inline-block border border-B0C4DB p-4 rounded-lg bg-white">
            sort
          </span>
        </div>
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
