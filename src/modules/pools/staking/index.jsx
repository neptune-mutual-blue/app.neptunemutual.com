import { useMemo, useState } from "react";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";
import { NeutralButton } from "@/common/Button/NeutralButton";
import { Container } from "@/common/Container/Container";
import { Grid } from "@/common/Grid/Grid";
import { SearchAndSortBar } from "@/common/SearchAndSortBar";
import { useAppConstants } from "@/src/context/AppConstants";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import { getProperty, sortList, SORT_TYPES } from "@/utils/sorting";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { COVERS_PER_PAGE } from "@/src/config/constants";
import {
  useStaking,
  withStaking,
} from "@/modules/pools/staking/StakingContext";
import { StakingCard } from "@/modules/pools/staking/StakingCard";
import { toBN } from "@/utils/bn";

function StakingPage() {
  const { data } = useStaking();
  const [sortType, setSortType] = useState({ name: t`${SORT_TYPES.AtoZ}` });

  const router = useRouter();

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: data,
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
      return [
        { name: t`${SORT_TYPES.AtoZ}` },
        { name: t`${SORT_TYPES.TVL}` },
        { name: t`${SORT_TYPES.APR}` },
      ];
    }

    return [
      { name: SORT_TYPES.AtoZ },
      { name: SORT_TYPES.TVL },
      { name: SORT_TYPES.APR },
    ];
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
}

function Content({ data }) {
  const { loading, hasMore, handleShowMore } = useStaking();
  const { getPriceByAddress } = useAppConstants();

  if (data.length) {
    return (
      <>
        <Grid className="mb-24 mt-14">
          {data.map((poolData) => (
            <StakingCard
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

const SORT_CALLBACK = {
  [SORT_TYPES.AtoZ]: (cover) => cover.name,
  [SORT_TYPES.TVL]: (cover) => {
    const tvl = getProperty(cover, "tvl", "0");

    return toBN(tvl);
  },
  [SORT_TYPES.APR]: (cover) => {
    const apr = getProperty(cover, "apr", "0");

    return toBN(apr);
  },
};

const getSortCallback = (sortTypeName) =>
  getProperty(SORT_CALLBACK, sortTypeName, SORT_CALLBACK[SORT_TYPES.AtoZ]);

export default withStaking(StakingPage);
