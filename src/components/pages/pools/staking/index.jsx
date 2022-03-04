import { NeutralButton } from "@/components/UI/atoms/button/neutral-button";
import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { SearchAndSortBar } from "@/components/UI/molecules/search-and-sort";
import { StakingCard } from "@/components/UI/organisms/pools/staking/StakingCard";
import { useAppConstants } from "@/src/context/AppConstants";
import { useTokenStakingPools } from "@/src/hooks/useTokenStakingPools";
import { useEffect, useState } from "react";

export const StakingPage = () => {
  const { getTVLById } = useAppConstants();
  const { data, loading } = useTokenStakingPools();
  const [searchValue, setSearchValue] = useState("");
  const [poolsToShow, setPoolsToShow] = useState([]);

  const searchHandler = (e) => {
    let inputValue = e.target.value;
    setSearchValue(inputValue);
    setPoolsToShow(
      data.pools.filter(
        (pool) => pool.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      )
    );
  };

  useEffect(() => {
    setPoolsToShow(data.pools);
  }, [data.pools]);

  return (
    <Container className={"pt-16 pb-36"}>
      <div className="flex justify-end">
        <SearchAndSortBar
          searchValue={searchValue}
          onSearchChange={searchHandler}
        />
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
        {poolsToShow.map((poolData) => {
          return (
            <StakingCard
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
