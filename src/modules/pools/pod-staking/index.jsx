import { useState } from "react";
import { NeutralButton } from "@/common/Button/NeutralButton";
import { Container } from "@/common/Container/Container";
import { Grid } from "@/common/Grid/Grid";
import { SearchAndSortBar } from "@/common/SearchAndSortBar";
import { PodStakingCard } from "@/src/modules/pools/pod-staking/PodStakingCard";
import { useAppConstants } from "@/src/context/AppConstants";
import { usePodStakingPools } from "@/src/hooks/usePodStakingPools";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import { sortData } from "@/utils/sorting";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { COVERS_PER_PAGE } from "@/src/config/constants";

export const PodStakingPage = () => {
  const { getTVLById, getPriceByAddress } = useAppConstants();
  const { data, loading, hasMore, handleShowMore } = usePodStakingPools();

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: data.pools,
    filter: (item, term) => {
      return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
    },
  });

  const [sortType, setSortType] = useState({ name: "A-Z" });

  const options = [{ name: "A-Z" }, { name: "TVL" }];
  const filteredPodStakingCardTvl = filtered.map((poolData) => {
    const tvl = getTVLById(poolData.id);

    return { ...poolData, tvl };
  });

  const searchHandler = (ev) => {
    setSearchValue(ev.target.value);
  };

  const renderPodStakingPools = () => {
    const noData = data.pools.length <= 0;

    if (!loading && !noData) {
      return (
        <Grid className="mb-24 mt-14">
          {sortData(filteredPodStakingCardTvl, sortType.name).map(
            (poolData) => {
              return (
                <PodStakingCard
                  key={poolData.id}
                  data={poolData}
                  tvl={poolData.tvl}
                  getPriceByAddress={getPriceByAddress}
                />
              );
            }
          )}
        </Grid>
      );
    } else if (!loading && noData) {
      return (
        <div className="flex flex-col items-center w-full pt-20">
          <img
            src="/images/covers/empty-list-illustration.svg"
            alt="no data found"
            className="w-48 h-48"
          />
          <p className="max-w-full mt-8 text-center text-h5 text-404040 w-96">
            No POD{" "}
            <span className="whitespace-nowrap">staking pools found.</span>
          </p>
        </div>
      );
    }

    return (
      <Grid className="mb-24 mt-14">
        <CardSkeleton numberOfCards={data.pools.length || COVERS_PER_PAGE} />
      </Grid>
    );
  };

  return (
    <Container className={"pt-16 pb-36"}>
      <div className="flex justify-end">
        <SearchAndSortBar
          searchValue={searchValue}
          onSearchChange={searchHandler}
          sortClass="w-full md:w-48 lg:w-64 rounded-lg z-10"
          containerClass="flex-col md:flex-row min-w-full md:min-w-sm"
          searchClass="w-full md:w-64 rounded-lg"
          searchAndSortOptions={options}
          sortType={sortType}
          setSortType={setSortType}
        />
      </div>

      {renderPodStakingPools()}

      {!loading && hasMore && (
        <NeutralButton
          className={"rounded-lg border-0.5"}
          onClick={handleShowMore}
        >
          Show More
        </NeutralButton>
      )}
    </Container>
  );
};
