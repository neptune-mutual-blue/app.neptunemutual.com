import { useState } from "react";
import { NeutralButton } from "@/common/Button/NeutralButton";
import { Container } from "@/common/Container/Container";
import { Grid } from "@/common/Grid/Grid";
import { SearchAndSortBar } from "@/common/SearchAndSortBar";
import { StakingCard } from "@/src/modules/pools/staking/StakingCard";
import { useAppConstants } from "@/src/context/AppConstants";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import { useTokenStakingPools } from "@/src/hooks/useTokenStakingPools";
import { sortData } from "@/utils/sorting";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { COVERS_PER_PAGE } from "@/src/config/constants";
import { t, Trans } from "@lingui/macro";

export const StakingPage = () => {
  const { getTVLById, getPriceByAddress } = useAppConstants();
  const { data, loading, hasMore, handleShowMore } = useTokenStakingPools();

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: data.pools,
    filter: (item, term) => {
      return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
    },
  });

  const [sortType, setSortType] = useState({ name: t`A-Z` });

  const options = [{ name: t`A-Z` }, { name: t`TVL` }];
  const filteredStakingCardTvl = filtered.map((poolData) => {
    const tvl = getTVLById(poolData.id);

    return { ...poolData, tvl };
  });

  const searchHandler = (ev) => {
    setSearchValue(ev.target.value);
  };

  const renderStakingPools = () => {
    const noData = data.pools.length <= 0;

    if (!loading && !noData) {
      return (
        <Grid className="mb-24 mt-14">
          {sortData(filteredStakingCardTvl, sortType.name).map((poolData) => {
            return (
              <StakingCard
                key={poolData.id}
                data={poolData}
                tvl={poolData.tvl}
                getPriceByAddress={getPriceByAddress}
              />
            );
          })}
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
            <Trans>
              No <span className="whitespace-nowrap">staking pools found.</span>
            </Trans>
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

      {renderStakingPools()}

      {!loading && hasMore && (
        <NeutralButton
          className={"rounded-lg border-0.5"}
          onClick={handleShowMore}
        >
          <Trans>Show More</Trans>
        </NeutralButton>
      )}
    </Container>
  );
};
