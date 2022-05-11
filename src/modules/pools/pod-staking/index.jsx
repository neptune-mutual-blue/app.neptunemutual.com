import { useMemo, useState } from "react";
import { NeutralButton } from "@/common/Button/NeutralButton";
import { Container } from "@/common/Container/Container";
import { Grid } from "@/common/Grid/Grid";
import { SearchAndSortBar } from "@/common/SearchAndSortBar";
import { PodStakingCard } from "@/src/modules/pools/pod-staking/PodStakingCard";
import { useAppConstants } from "@/src/context/AppConstants";
import { usePodStakingPools } from "@/src/hooks/usePodStakingPools";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import { getProperty, sortList, SORT_TYPES } from "@/utils/sorting";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { COVERS_PER_PAGE } from "@/src/config/constants";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";

export const PodStakingPage = () => {
  const [sortType, setSortType] = useState({ name: t`${SORT_TYPES.AtoZ}` });

  const { data } = usePodStakingPools();
  const router = useRouter();

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: data.pools,
    filter: (item, term) => {
      return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
    },
  });

  const sortedPools = useMemo(
    () => sortList(filtered, getSortCallback(sortType.name), sortType.name),
    [filtered, sortType.name]
  );

  const options = useMemo(() => {
    if (router.locale) {
      return [{ name: t`${SORT_TYPES.AtoZ}` }, { name: t`${SORT_TYPES.TVL}` }];
    }

    return [{ name: SORT_TYPES.AtoZ }, { name: SORT_TYPES.TVL }];
  }, [router.locale]);

  return (
    <Container className={"pt-16 pb-36"}>
      <div className="flex justify-end">
        <SearchAndSortBar
          searchValue={searchValue}
          onSearchChange={(event) => {
            setSearchValue(event.target.value);
          }}
          sortClass="w-full md:w-48 lg:w-64 rounded-lg z-10"
          containerClass="flex-col md:flex-row min-w-full md:min-w-sm"
          searchClass="w-full md:w-64 rounded-lg"
          searchAndSortOptions={options}
          sortType={sortType}
          setSortType={setSortType}
        />
      </div>

      <Content data={sortedPools} />
    </Container>
  );
};

function Content({ data }) {
  const { loading, hasMore, handleShowMore } = usePodStakingPools();
  const { getPriceByAddress } = useAppConstants();

  if (data.length) {
    return (
      <>
        <Grid className="mb-24 mt-14">
          {data.map((poolData) => (
            <PodStakingCard
              key={poolData.id}
              data={poolData}
              tvl={poolData.tvl}
              getPriceByAddress={getPriceByAddress}
            />
          ))}
        </Grid>
        {!loading && hasMore && (
          <NeutralButton
            className={"rounded-lg border-0.5"}
            onClick={handleShowMore}
          >
            <Trans>Show More</Trans>
          </NeutralButton>
        )}
      </>
    );
  }

  if (loading) {
    return (
      <Grid className="mb-24 mt-14">
        <CardSkeleton numberOfCards={data.length || COVERS_PER_PAGE} />
      </Grid>
    );
  }

  return (
    <div className="flex flex-col items-center w-full pt-20">
      <img
        src="/images/covers/empty-list-illustration.svg"
        alt={t`no data found`}
        className="w-48 h-48"
      />
      <p className="max-w-full mt-8 text-center text-h5 text-404040 w-96">
        <Trans>No POD</Trans>{" "}
        <span className="whitespace-nowrap">
          <Trans>staking pools found.</Trans>
        </span>
      </p>
    </div>
  );
}

const SORT_CALLBACK = {
  [SORT_TYPES.AtoZ]: (cover) => cover.name,
  [SORT_TYPES.TVL]: (cover) => {
    const tvl = getProperty(cover, "tvl", "0");

    return Number(tvl);
  },
};

const getSortCallback = (sortTypeName) =>
  getProperty(SORT_CALLBACK, sortTypeName, SORT_CALLBACK[SORT_TYPES.AtoZ]);
