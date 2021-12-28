import { useAvailableStakings } from "@/components/pages/pools/staking/useAvailableStakings";
import { useEarningPercentage } from "@/components/pages/pools/staking/useEarningPercentage";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { StakingCard } from "@/components/UI/organisms/pools/staking/stakingCard";
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

  const handleStaked = (id, stakedAmt) => {
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
    <Container>
      <div className="flex justify-between">
        <div>
          <span className="inline-block border border-B0C4DB p-4 mr-4 rounded-lg bg-FEFEFF">
            search
          </span>
          <span className="inline-block border border-B0C4DB p-4 rounded-lg bg-FEFEFF">
            sort
          </span>
        </div>
      </div>
      <Grid className="mt-14 mb-24">
        {availableStakings.map((c) => {
          return (
            <Link href="#" key={c.name}>
              <a className="rounded-4xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-black focus:outline-none">
                <StakingCard
                  id={c.id}
                  details={c}
                  staked={staked}
                  handleStaked={handleStaked}
                  earnPercent={earningPercent}
                ></StakingCard>
              </a>
            </Link>
          );
        })}
      </Grid>
      <OutlinedButton
        className={"!border-B0C4DB block text-B0C4DB m-auto mb-10"}
      >
        Show More
      </OutlinedButton>
    </Container>
  );
};
