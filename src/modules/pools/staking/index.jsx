import { useMemo, useState } from "react";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";

import { NeutralButton } from "@/common/Button/NeutralButton";
import { Container } from "@/common/Container/Container";
import { Grid } from "@/common/Grid/Grid";
import { SearchAndSortBar } from "@/common/SearchAndSortBar";
import { useAppConstants } from "@/src/context/AppConstants";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import { sorter, SORT_TYPES, SORT_DATA_TYPES } from "@/utils/sorting";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { CARDS_PER_PAGE } from "@/src/config/constants";
import { StakingCard } from "@/modules/pools/staking/StakingCard";
import { useTokenStakingPools } from "@/src/hooks/useTokenStakingPools";
import { useSortableStats } from "@/src/context/SortableStatsContext";
import { toStringSafe } from "@/utils/string";
import { useTransactionHistory } from "@/src/hooks/useTransactionHistory";
import { TransactionHistory } from "@/src/services/transactions/transaction-history";

/**
 * @type {Object.<string, {selector:(any) => any, datatype: any, ascending?: boolean }>}
 */
const sorterData = {
  [SORT_TYPES.ALPHABETIC]: {
    selector: (pool) => pool.name,
    datatype: SORT_DATA_TYPES.STRING,
  },
  [SORT_TYPES.TVL]: {
    selector: (pool) => pool.tvl,
    datatype: SORT_DATA_TYPES.BIGNUMBER,
  },
  [SORT_TYPES.APR]: {
    selector: (pool) => pool.apr,
    datatype: SORT_DATA_TYPES.BIGNUMBER,
  },
};

export const StakingPage = () => {
  const [sortType, setSortType] = useState({
    name: t`${SORT_TYPES.ALPHABETIC}`,
  });
  const router = useRouter();

  const { data, loading, hasMore, handleShowMore } = useTokenStakingPools();
  const { getStatsByKey } = useSortableStats();
  const { getTVLById } = useAppConstants();

  useTransactionHistory(
    "StakingPools",
    (instance, { pushError, pushSuccess }) => {
      TransactionHistory.process(
        TransactionHistory.METHODS.STAKING_DEPOSIT,
        TransactionHistory.callback(instance, {
          success: ({ hash, data: tokenSymbol }) => {
            pushSuccess(t`Approved ${tokenSymbol} Successfully`, hash);
          },
          failure: ({ hash, data: tokenSymbol }) => {
            pushError(t`Could not approve ${tokenSymbol}`, hash);
          },
        })
      );
    }
  );

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: data.pools.map((pool) => ({
      ...pool,
      tvl: getTVLById(pool.id),
      ...getStatsByKey(pool.id),
    })),

    filter: (item, term) => {
      return toStringSafe(item.name).indexOf(toStringSafe(term)) > -1;
    },
  });

  const sortedPools = useMemo(
    () =>
      sorter({
        ...sorterData[sortType.name],
        list: filtered,
      }),
    [filtered, sortType.name]
  );

  const options = useMemo(() => {
    if (router.locale) {
      return [
        { name: t`${SORT_TYPES.ALPHABETIC}` },
        { name: t`${SORT_TYPES.TVL}` },
        { name: t`${SORT_TYPES.APR}` },
      ];
    }

    return [
      { name: SORT_TYPES.ALPHABETIC },
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

      <Content
        data={sortedPools}
        loading={loading}
        hasMore={hasMore}
        handleShowMore={handleShowMore}
      />
    </Container>
  );
};

function Content({ data, loading, hasMore, handleShowMore }) {
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
        <CardSkeleton numberOfCards={data.length || CARDS_PER_PAGE} />
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
        <Trans>
          No <span className="whitespace-nowrap">staking pools found.</span>
        </Trans>
      </p>
    </div>
  );
}
